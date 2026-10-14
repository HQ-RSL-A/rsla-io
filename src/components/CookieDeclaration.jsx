import { useEffect, useRef } from 'react';

// CookieScript's live cookie list for rsla.io. Their script finds the first [data-cookiescriptreport] element
// and inserts the current declaration after it, so it always matches the latest scan and the cookies added by hand
// (a per-scan report link goes stale after every scan). React renders the wrapper empty and never touches its
// contents; the marker, the script and the inserted tables all live inside it.
const REPORT_SRC = 'https://report.cookie-script.com/r/440ed9df232ca19a993a46bb94f4cdbe.js';

export default function CookieDeclaration() {
    const wrapper = useRef(null);

    useEffect(() => {
        const el = wrapper.current;
        if (!el) return undefined;
        const marker = document.createElement('div');
        marker.setAttribute('data-cookiescriptreport', 'report');
        const script = document.createElement('script');
        script.src = REPORT_SRC;
        script.charset = 'UTF-8';
        script.async = true;
        el.append(marker, script);
        return () => { el.replaceChildren(); };
    }, []);

    return <div ref={wrapper} className="mb-8 overflow-x-auto text-sm" />;
}
