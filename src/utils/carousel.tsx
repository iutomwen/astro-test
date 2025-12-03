"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function MobileCarousel({ items }) {
  const dotsRef = useRef([]);

  useEffect(() => {
    const slides = [...document.querySelectorAll("[data-slide]")];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const activeIndex = Number(entry.target.dataset.slide);

            // update aria-current on dots
            dotsRef.current.forEach((dot, i) => {
              if (!dot) return;
              dot.setAttribute(
                "aria-current",
                i + 1 === activeIndex ? "true" : "false"
              );
            });
          }
        });
      },
      {
        threshold: 0.55, // enough to feel “natural” on mobile swipe
      }
    );

    slides.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-label="Mobile carousel"
      className="relative max-w-md mx-auto sm:hidden"
    >
      {/* Scroll container */}
      <div
        id="carousel"
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 py-6 touch-pan-x"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {items.map((item, index) => (
          <article
            key={item.id ?? index}
            id={`slide-${index + 1}`}
            data-slide={index + 1}
            className="snap-start flex-none w-[86vw] max-w-[360px] bg-white rounded-2xl shadow-md overflow-hidden"
            aria-label={`Slide ${index + 1} of ${items.length}`}
          >
            <div className="relative h-44 w-full">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 86vw, 360px"
                style={{ objectFit: "cover" }}
                priority={index === 0}
              />
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-gray-600 mt-2">{item.description}</p>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* DOTS */}
      <div className="absolute left-0 right-0 bottom-3 flex justify-center gap-3 z-10">
        {items.map((_, index) => (
          <a
            key={index}
            ref={(el) => (dotsRef.current[index] = el)}
            href={`#slide-${index + 1}`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === 0 ? "true" : "false"} // default first active
            className="dot w-3 h-3 rounded-full bg-gray-300 transition-all duration-300 ease-out"
          />
        ))}
      </div>

      <style jsx>{`
        #carousel {
          scrollbar-width: none;
        }
        #carousel::-webkit-scrollbar {
          display: none;
        }

        /* Default: dots are small / soft */
        .dot {
          transform: scale(1);
          opacity: 0.5;
        }

        /* Active state (scale + color + full opacity) */
        .dot[aria-current="true"] {
          background: #111;
          transform: scale(1.45);
          opacity: 1;
        }
      `}</style>
    </section>
  );
}




import Image from "next/image";

export default function MobileCarousel({ items }) {
  return (
    <section
      aria-label="Mobile carousel"
      className="relative max-w-md mx-auto sm:hidden"
    >
      {/* Scroll container */}
      <div
        id="carousel"
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 py-6 touch-pan-x"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {items.map((item, index) => (
          <article
            key={item.id ?? index}
            id={`slide-${index + 1}`}
            className="snap-start flex-none w-[86vw] max-w-[360px] bg-white rounded-2xl shadow-md overflow-hidden"
            aria-label={`Slide ${index + 1} of ${items.length}`}
          >
            <div className="relative h-44 w-full">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 86vw, 360px"
                style={{ objectFit: "cover" }}
                priority={index === 0}
              />
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-gray-600 mt-2">
                  {item.description}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute left-0 right-0 bottom-3 flex justify-center gap-3 z-10">
        {items.map((_, index) => (
          <a
            key={index}
            href={`#slide-${index + 1}`}
            aria-label={`Go to slide ${index + 1}`}
            className={`dot-${index + 1} w-3 h-3 rounded-full bg-gray-300 transition-all`}
          />
        ))}
      </div>

      {/* Dot highlight logic */}
      <style jsx>{`
        #carousel {
          scrollbar-width: none;
        }
        #carousel::-webkit-scrollbar {
          display: none;
        }

        :target {
          scroll-margin-left: 1rem;
        }

        /* When targeted slide is active, highlight its dot */
        ${items
          .map(
            (_, index) => `
          #slide-${index + 1}:target ~ div .dot-${index + 1} {
            background: #111;
            width: 0.75rem;
            height: 0.75rem;
          }
        `
          )
          .join("\n")}

        /* Default highlight for first slide on initial load */
        .dot-1 {
          background: #111;
          width: 0.75rem;
          height: 0.75rem;
        }
      `}</style>
    </section>
  );
}