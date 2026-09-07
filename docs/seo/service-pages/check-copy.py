#!/usr/bin/env python3
"""Measure and QA the service page copy files in this folder.

Run from anywhere:  python3 docs/seo/service-pages/check-copy.py
Never type a count into a copy file; this script is the source of every number.

Checks (per page): title <= 60 chars, meta 120 to 156 chars, one H1, keyword words in
title and H1, body word count at or above the low end of the competitor band and no
more than 10 percent over the high end, the exact keyword phrase at least twice on the
page (H1 included, so at least once in the body), Bakersfield in at least half the H2s
on the /bakersfield pages, H2 and FAQ counts, CTA count >= 3, at least one external
link, every front matter internal link used in the body, every internal link pointing
at a known route.
Checks (cross page): unique titles and metas (Jaccard < 0.6), no H2 reused verbatim,
no sentence shared verbatim and no sentence pair above 0.55 Jaccard (testimonial
quotes and CTA lines excluded), no em or en dashes, no banned words or cliches
(Rahul, 2026-09-06: no "elevate your business" hero lines, no "seamless" and
"cutting edge" filler, no "passionate team" about copy, no Strategy / Design /
Delivery card triads, no "ready to get started" CTAs; say what we do, for whom,
with a number where an adjective would go).
"""
import re, sys, glob, os, itertools, json

HERE = os.path.dirname(os.path.abspath(__file__))
FILES = sorted(glob.glob(os.path.join(HERE, "*.md")))
FILES = [f for f in FILES if os.path.basename(f) not in ("README.md", "tracker.md", "qa-pass.md")]

KNOWN_ROUTES = {
    "/", "/about", "/services", "/work", "/blog", "/contact",
    "/services/websites", "/services/websites/redesign", "/services/seo", "/services/seo/local",
    "/services/seo/programmatic", "/services/automations", "/services/crm", "/services/custom-builds",
    "/bakersfield", "/bakersfield/websites", "/bakersfield/seo", "/bakersfield/automations", "/bakersfield/crm",
}
PUBLISHED_WORK = ["rsla-organic-growth", "notion-productivity-dashboard-anchor-safety",
                  "ai-cold-email-personalization", "salon-marketing-automation-roi",
                  "fieldshare-seo-website-rebrand"]
PUBLISHED_POSTS = ["automate-client-intake-ai", "med-spa-seo-what-actually-works",
                   "anthropic-claude-products-guide", "aeo-for-local-businesses",
                   "ai-marketing-stack-what-we-use", "claude-code-marketing-agency-workflow",
                   "claude-code-vs-cowork-vs-claude-app", "gohighlevel-workflow-automations-guide",
                   "gohighlevel-funnel-tutorial-high-converting", "gohighlevel-lead-follow-up-automation",
                   "gohighlevel-vs-jobber-home-service-crm", "gohighlevel-for-restaurants-fill-tables",
                   "gohighlevel-vs-hubspot-comparison", "gohighlevel-updates-2026", "go-high-level-pricing",
                   "what-is-go-high-level", "how-to-rank-higher-on-google-maps-a-comprehensive-guide",
                   "google-business-profile-optimization-guide-2026"]
KNOWN_ROUTES |= {f"/work/{s}" for s in PUBLISHED_WORK}
KNOWN_ROUTES |= {f"/blog/{s}" for s in PUBLISHED_POSTS}

BANNED = [
    "leverage", "synergy", "streamline", "seamless", "robust", "elevate", "empower", "unlock",
    "delve", "tapestry", "landscape", "pivotal", "testament", "vibrant", "profound", "nestled",
    "boasts", "fostering", "garner", "showcase", "underscore", "additionally", "crucial", "enhance",
    "enduring", "interplay", "intricate", "exemplifies", "holistic", "cutting edge", "cutting-edge",
    "game changer", "game-changer", "navigate", "in today's", "look no further", "moreover",
    "furthermore", "that said", "it's worth noting", "importantly", "notably", "digital marketing",
    "founders", "stands as", "serves as", "i'll be honest", "to be honest", "we pride ourselves",
    "we understand", "we believe", "tailored", "bespoke", "world-class", "world class", "top-notch",
    "stunning", "incredible", "amazing", "revolutionary", "groundbreaking", "sound familiar",
    # cliches Rahul flagged 2026-09-06: hero lines, value prop filler, about page filler, CTAs
    "next level", "transforming ideas", "ideas into reality", "innovation meets", "digital journey",
    "fast paced", "fast-paced", "unique needs", "scalable", "solutions", "passionate", "dedicated to",
    "exceptional results", "our mission", "mission is to", "thrive", "ready to get started",
    "let's build", "your potential", "get started today", "take your business", "one stop",
    "one-stop", "results driven", "results-driven", "customer centric", "customer-centric",
]
WATCH = ["optimiz", "honest", "actually", "really", "very", "just", "simple", "simply", "not just", "more than just", "is not about", "at the end of the day", "whether you", "it is not a", "not a .{3,30}, it is"]

def parse(path):
    raw = open(path, encoding="utf-8").read()
    m = re.match(r"---\n(.*?)\n---\n(.*)", raw, re.S)
    fm_raw, body = m.group(1), m.group(2)
    fm = {}
    for line in fm_raw.splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            fm[k.strip()] = v.strip()
    body = body.split("\n## Build notes")[0]
    return fm, body, raw

def visible_lines(body):
    """Lines a visitor reads. Drops comments, CTA markers, separators."""
    out = []
    for line in body.splitlines():
        s = line.strip()
        if not s or s.startswith("<!--") or s.startswith("[CTA]") or s == "---":
            continue
        out.append(s)
    return out

def words(text):
    return re.findall(r"[A-Za-z0-9$][A-Za-z0-9$',.%/]*", text)

def strip_md(s):
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)  # links to anchor text
    s = re.sub(r"^#+\s*", "", s)
    s = s.replace("**", "")
    return s

def sentences(text):
    text = strip_md(text)
    parts = re.split(r"(?<=[.!?])\s+", text)
    return [p.strip() for p in parts if len(p.split()) >= 6]

def norm(s):
    return set(re.findall(r"[a-z0-9]+", s.lower()))

def jaccard(a, b):
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)

pages = []
problems = []
for path in FILES:
    fm, body, raw = parse(path)
    name = os.path.basename(path)
    lines = visible_lines(body)
    h1s = [l for l in lines if l.startswith("# ")]
    h2s = [strip_md(l) for l in lines if l.startswith("## ")]
    h3s = [strip_md(l) for l in lines if l.startswith("### ")]
    # FAQ = h3s that end with ?
    faqs = [h for h in h3s if h.endswith("?")]
    text_lines = [strip_md(l) for l in lines]
    body_text = "\n".join(text_lines)
    wc = len(words(body_text))
    kw = fm.get("keyword", "").lower()
    kw_exact = len(re.findall(re.escape(kw), body_text.lower()))
    kw_words = [w for w in re.findall(r"[a-z0-9]+", kw) if w not in ("for", "in", "of", "the", "a", "and")]
    # loose: sentences containing every keyword word
    loose = sum(1 for s in re.split(r"(?<=[.!?\n])\s+", body_text.lower()) if all(w in re.findall(r"[a-z0-9]+", s) for w in kw_words))
    title = fm.get("title", "")
    meta = fm.get("meta", "")
    ctas = len(re.findall(r"^\[CTA\]", body, re.M))
    ext = re.findall(r"\]\((https?://[^)]+)\)", body)
    internal = re.findall(r"\]\((/[^)]*)\)", body)
    fm_internal = [x.strip() for x in fm.get("internal_links", "").split(",") if x.strip()]
    fm_internal = [x.split(" ")[0] for x in fm_internal]
    dashes = [(i + 1, l) for i, l in enumerate(raw.splitlines()) if "–" in l or "—" in l]
    low = body_text.lower()
    low_scan = re.sub(r"landscap(?:ing|er|ers)\b|landscape (?:design|company|companies|contractor)", "", low)
    banned_hits = [b for b in BANNED if re.search(r"\b" + re.escape(b) + r"\b", low_scan)]
    watch_hits = {w: len(re.findall(r"\b" + w + r"\w*", low)) for w in WATCH if re.findall(r"\b" + w + r"\w*", low)}
    h1_text = strip_md(h1s[0]) if h1s else ""
    def stems(s):
        return {w[:5] for w in norm(s)}
    tw, hw = stems(title), stems(h1_text)
    missing_title = [w for w in kw_words if w[:5] not in tw]
    missing_h1 = [w for w in kw_words if w[:5] not in hw]
    target = fm.get("word_target", "")
    content_h2s = [h for h in h2s if h.lower() != "final cta"]
    city_h2s = [h for h in content_h2s if "bakersfield" in h.lower()]
    page = dict(name=name, url=fm.get("url"), keyword=kw, title=title, title_len=len(title), meta=meta,
                meta_len=len(meta), h1=h1_text, h1_count=len(h1s), words=wc, target=target, h2=len(h2s),
                h2_list=h2s, faq=len(faqs), kw_exact=kw_exact, kw_loose=loose, ctas=ctas, ext=len(ext),
                internal=internal, fm_internal=fm_internal, dashes=dashes, banned=banned_hits,
                watch=watch_hits, missing_title=missing_title, missing_h1=missing_h1,
                city_h2=f"{len(city_h2s)}/{len(content_h2s)}", lines=lines)
    pages.append(page)
    # per page problems
    if len(title) > 60: problems.append(f"{name}: title {len(title)} chars (>60)")
    if not (120 <= len(meta) <= 156): problems.append(f"{name}: meta {len(meta)} chars (need 120 to 156)")
    if len(h1s) != 1: problems.append(f"{name}: {len(h1s)} H1s")
    if missing_title: problems.append(f"{name}: keyword words missing from title: {missing_title}")
    if missing_h1: problems.append(f"{name}: keyword words missing from H1: {missing_h1}")
    if not (3 <= len(faqs) <= 4): problems.append(f"{name}: {len(faqs)} FAQs (need 3 to 4)")
    if ctas < 3: problems.append(f"{name}: only {ctas} CTAs")
    if not ext: problems.append(f"{name}: no external link")
    for l in fm_internal:
        if l not in internal: problems.append(f"{name}: front matter internal link not used in body: {l}")
    for l in internal:
        if l.split("#")[0] not in KNOWN_ROUTES: problems.append(f"{name}: unknown internal link {l}")
    for ln, l in dashes: problems.append(f"{name}: dash on line {ln}: {l[:60]}")
    for b in banned_hits: problems.append(f"{name}: banned word '{b}'")
    m = re.findall(r"(\d+)\s*(?:to|-)\s*(\d+)", target)
    if m:
        lo, hi = int(m[0][0]), int(m[0][1])
        if not (lo <= wc <= hi * 1.1): problems.append(f"{name}: {wc} words vs target {target} (must reach the low end)")
    if kw_exact < 2: problems.append(f"{name}: exact phrase '{kw}' appears {kw_exact} time(s) (need 2 or more, H1 included)")
    if (fm.get("url") or "").startswith("/bakersfield") and len(city_h2s) * 2 < len(content_h2s):
        problems.append(f"{name}: Bakersfield in {len(city_h2s)} of {len(content_h2s)} H2s (need at least half)")

# cross page
for a, b in itertools.combinations(pages, 2):
    if a["title"].lower() == b["title"].lower(): problems.append(f"duplicate title: {a['name']} / {b['name']}")
    jm = jaccard(norm(a["meta"]), norm(b["meta"]))
    if jm >= 0.6: problems.append(f"metas too similar ({jm:.2f}): {a['name']} / {b['name']}")
    shared_h2 = set(h.lower() for h in a["h2_list"]) & set(h.lower() for h in b["h2_list"])
    shared_h2 -= {"final cta", "how it runs", "proof"}
    for h in shared_h2: problems.append(f"H2 reused: '{h}' in {a['name']} and {b['name']}")

def page_sentences(p):
    out = []
    for l in p["lines"]:
        if l.startswith('"') or l.startswith("#"):
            continue
        if re.match(r"^[A-Z][a-z]+ [A-Z]\., ", l):  # testimonial attribution line
            continue
        for s in sentences(l):
            out.append(s)
    return out

dupes = []
for a, b in itertools.combinations(pages, 2):
    sa, sb = page_sentences(a), page_sentences(b)
    na = [(s, norm(s)) for s in sa]
    nb = [(s, norm(s)) for s in sb]
    for s1, n1 in na:
        for s2, n2 in nb:
            if s1.lower() == s2.lower():
                dupes.append((1.0, a["name"], b["name"], s1))
            else:
                j = jaccard(n1, n2)
                if j >= 0.55:
                    dupes.append((j, a["name"], b["name"], s1 + "  ||  " + s2))

print("PAGE MANIFEST")
print(f"{'file':<34} {'title':>5} {'meta':>4} {'words':>5} {'target':<12} {'H2':>2} {'FAQ':>3} {'kw':>3} {'kw~':>3} {'CTA':>3} {'ext':>3}")
for p in pages:
    print(f"{p['name']:<34} {p['title_len']:>5} {p['meta_len']:>4} {p['words']:>5} {p['target'][:12]:<12} {p['h2']:>2} {p['faq']:>3} {p['kw_exact']:>3} {p['kw_loose']:>3} {p['ctas']:>3} {p['ext']:>3}")
print()
print("WATCH WORDS (count per page, review by hand)")
for p in pages:
    if p["watch"]: print(f"  {p['name']}: {p['watch']}")
print()
print(f"PROBLEMS ({len(problems)})")
for pr in problems: print("  -", pr)
print()
print(f"SHARED SENTENCES ({len(dupes)}) [jaccard >= 0.55, testimonials and CTA lines excluded]")
for j, a, b, s in sorted(dupes, reverse=True):
    print(f"  {j:.2f} {a} / {b}\n      {s[:220]}")
print()
if "--json" in sys.argv:
    json.dump([{k: v for k, v in p.items() if k not in ("lines",)} for p in pages], open(os.path.join(HERE, "manifest.json"), "w"), indent=2)
    print("wrote manifest.json")
sys.exit(1 if problems else 0)
