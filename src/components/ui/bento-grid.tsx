import { type ComponentPropsWithoutRef, type ReactNode, useRef, useState, useEffect, useCallback, Children } from "react"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface BentoCardProps {
  name: string
  className: string
  background: ReactNode
  Icon: React.ElementType
  href: string
  cta: string
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const count = Children.count(children)

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const scrollLeft = el.scrollLeft
    const cardWidth = el.firstElementChild?.getBoundingClientRect().width ?? 1
    const gap = 16
    const index = Math.round(scrollLeft / (cardWidth + gap))
    setActiveIndex(Math.min(index, count - 1))
  }, [count])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => el.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  return (
    <div>
      <div
        ref={scrollRef}
        className={cn(
          "flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 scrollbar-hide",
          "lg:grid lg:w-full lg:auto-rows-[22rem] lg:grid-cols-3 lg:overflow-visible lg:snap-none lg:pb-0 lg:mx-0 lg:px-0",
          className
        )}
        {...props}
      >
        {children}
      </div>
      <div className="flex justify-center gap-2 mt-4 lg:hidden">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => {
              const el = scrollRef.current
              if (!el) return
              const card = el.children[i] as HTMLElement
              if (card) card.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" })
            }}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === activeIndex ? "w-6 bg-accent" : "w-2 bg-accent/25"
            )}
          />
        ))}
      </div>
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  href,
  cta,
}: BentoCardProps) => (
  <Link
    to={href}
    className={cn(
      "group relative flex flex-col justify-between overflow-hidden rounded-xl cursor-pointer",
      "w-[calc(100vw-3rem)] min-w-[calc(100vw-3rem)] h-[22rem] snap-center",
      "lg:w-auto lg:min-w-0 lg:h-auto lg:snap-align-none lg:col-span-3",
      "bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      "dark:bg-background transform-gpu dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]",
      className
    )}
  >
    <div>{background}</div>
    <div className="p-4">
      <div className="z-10 flex transform-gpu flex-col gap-1 transition-transform duration-lg ease-out-smooth lg:group-hover:-translate-y-10">
        <Icon className="h-12 w-12 origin-left transform-gpu text-neutral-700 transition-transform duration-lg ease-out-smooth group-hover:scale-75" />
        <h3 className="font-sans text-xl md:text-2xl font-semibold text-text">
          {name}
        </h3>
      </div>

      <div className="flex w-full transform-gpu flex-row items-center transition-transform duration-lg ease-out-smooth lg:hidden">
        <span className="inline-flex items-center font-sans text-sm font-semibold text-accent p-0">
          {cta}
          <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
        </span>
      </div>
    </div>

    <div className="absolute bottom-0 hidden w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-[transform,opacity] duration-lg ease-out-smooth group-hover:translate-y-0 group-hover:opacity-100 lg:flex">
      <span className="inline-flex items-center font-sans text-sm font-semibold text-accent p-0">
        {cta}
        <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
      </span>
    </div>

    <div className="pointer-events-none absolute inset-0 transform-gpu transition-colors duration-lg ease-out-smooth group-hover:bg-black/3 group-hover:dark:bg-neutral-800/10" />
  </Link>
)

export { BentoCard, BentoGrid }
