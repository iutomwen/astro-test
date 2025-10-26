"use client";

import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";

export type Testimonial = {
  id: string;
  name: string;
  title?: string;
  quote: string;
  imageSrc: string;
  imageAlt?: string;
};

interface TestimonialsProps {
  testimonials: Testimonial[];
  className?: string;
}

const TRANSITION_MS = 360;

export default function Testimonials({
  testimonials,
  className = "",
}: TestimonialsProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [animKey, setAnimKey] = useState(0);

  const total = testimonials.length;
  const current = testimonials[index];
  const prevIndex = (index - 1 + total) % total;
  const nextIndex = (index + 1) % total;

  const prev = useCallback(() => {
    setDirection("left");
    setIndex((i) => (i - 1 + total) % total);
    setAnimKey((k) => k + 1);
  }, [total]);

  const next = useCallback(() => {
    setDirection("right");
    setIndex((i) => (i + 1) % total);
    setAnimKey((k) => k + 1);
  }, [total]);

  const liveLabel = useMemo(
    () => `${current.name} — ${current.title ?? ""}: ${current.quote}`,
    [current]
  );

  return (
    <section className={`max-w-5xl mx-auto px-6 py-16 ${className}`}>
      <h2 className="text-3xl font-extrabold text-center mb-2">
        Client Testimonials
      </h2>
      <p className="text-center text-sm text-gray-500 mb-10">
        What people say about working with me
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
        {/* Left: image */}
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 shrink-0">
          <Image
            src={current.imageSrc}
            alt={current.imageAlt ?? `${current.name} headshot`}
            fill
            className="rounded-2xl object-cover shadow-lg relative z-10"
            priority={index === 0}
            fetchPriority={index === 0 ? "high" : "auto"}
          />
          <div className="pointer-events-none absolute -left-3 -top-3 w-44 h-44 sm:w-56 sm:h-56 rounded-2xl overflow-hidden transform rotate-1 z-0 opacity-30">
            <Image
              src={testimonials[prevIndex].imageSrc}
              alt=""
              fill
              className="object-cover blur-sm"
            />
          </div>
          <div className="pointer-events-none absolute -right-3 top-3 w-44 h-44 sm:w-56 sm:h-56 rounded-2xl overflow-hidden transform -rotate-1 z-0 opacity-30">
            <Image
              src={testimonials[nextIndex].imageSrc}
              alt=""
              fill
              className="object-cover blur-sm"
            />
          </div>
        </div>

        {/* Right: testimonial card */}
        <div className="max-w-lg w-full">
          <div
            key={`${current.id}-${animKey}`}
            className="bg-white/90 dark:bg-gray-900/80 p-6 rounded-xl shadow-sm ring-1 ring-gray-100 dark:ring-gray-800"
          >
            <AnimatedCard direction={direction} duration={TRANSITION_MS}>
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                      {current.name}
                    </h3>
                    {current.title && (
                      <p className="text-xs text-gray-400 mt-1">
                        {current.title}
                      </p>
                    )}
                  </div>
                </div>

                <blockquote className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                  “{current.quote}”
                </blockquote>

                <div className="mt-5 flex items-center gap-3">
                  <button
                    onClick={prev}
                    aria-label="Previous testimonial"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/60 shadow-sm ring-1 ring-gray-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
                  >
                    ‹
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next testimonial"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/60 shadow-sm ring-1 ring-gray-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
                  >
                    ›
                  </button>

                  <div className="ml-auto text-xs text-gray-400">
                    {index + 1} / {total}
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>

      {/* Accessibility live region */}
      <div aria-live="polite" className="sr-only">
        {liveLabel}
      </div>
    </section>
  );
}

/* Simple GPU-accelerated slide animation */
type AnimatedCardProps = {
  children: React.ReactNode;
  direction: "left" | "right";
  duration?: number;
};

const AnimatedCard = ({
  children,
  direction,
  duration = 360,
}: AnimatedCardProps) => {
  const [visible, setVisible] = React.useState(false);
  const fromX = direction === "right" ? 40 : -40;

  const style: React.CSSProperties = {
    transform: visible ? "translateX(0)" : `translateX(${fromX}px)`,
    opacity: visible ? 1 : 0,
    transition: `transform ${duration}ms cubic-bezier(.2,.9,.2,1), opacity ${duration}ms ease`,
    willChange: "transform, opacity",
  };

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [direction]);

  return <div style={style}>{children}</div>;
};




const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "MrBeast",
    title: "CEO at Beast",
    quote: "Sonny's content gives away more value than I give away Teslas.",
    imageSrc: "/images/mrbeast.webp",
    imageAlt: "MrBeast headshot",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    title: "CTO at Compute",
    quote:
      "A truly remarkable developer with an eye for detail and scalability.",
    imageSrc: "/images/ada.webp",
    imageAlt: "Ada Lovelace portrait",
  },
  {
    id: "3",
    name: "Linus Tech",
    title: "Founder at LTT",
    quote: "Code so efficient, it feels like optimized silicon.",
    imageSrc: "/images/linus.webp",
    imageAlt: "Linus headshot",
  },
];
