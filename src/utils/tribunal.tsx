// types/team.ts
export type TeamMember = {
  name: string
  role: string
  image: string
}

// data/team.ts
import { TeamMember } from "@/types/team"

export const team: TeamMember[] = [
  {
    name: "Anisa Akram",
    role: "Trainee Solicitor",
    image: "/images/anisa.jpg",
  },
  {
    name: "Maisie Flood",
    role: "Workforce Planning & Business Support",
    image: "/images/maisie.jpg",
  },
  {
    name: "Nicole Smith",
    role: "Litigation Executive",
    image: "/images/nicole.jpg",
  },
]



// components/PeopleCarousel.tsx
"use client"

import { team } from "@/data/team"

export default function PeopleCarousel() {
  return (
    <section className="relative w-full bg-gradient-to-br from-blue-700 to-blue-900 py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-10 text-white">
          <h2 className="text-3xl font-bold">Powered by People</h2>
          <p className="mt-4 max-w-2xl text-sm text-blue-100">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          <a
            href="#card-1"
            className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur md:flex"
          >
            ‹
          </a>

          {/* Cards */}
          <div
            className="
              flex gap-6 overflow-x-auto scroll-smooth
              snap-x snap-mandatory
              scrollbar-hide
            "
          >
            {team.map((person, index) => (
              <div
                key={person.name}
                id={`card-${index + 1}`}
                className="
                  snap-center
                  min-w-full
                  md:min-w-[33%]
                "
              >
                <div className="rounded-xl bg-white p-6 shadow-lg">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="h-64 w-full rounded-lg object-cover"
                  />

                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-900">
                      {person.name}
                    </h3>
                    <p className="text-sm text-gray-500">{person.role}</p>
                  </div>

                  <button className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    Read more
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <a
            href="#card-3"
            className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur md:flex"
          >
            ›
          </a>
        </div>

        {/* Pagination Dots */}
        <div className="mt-6 flex justify-center gap-2 md:hidden">
          {team.map((_, i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-white/40"
            />
          ))}
        </div>
      </div>
    </section>
  )
}


/* globals.css */
.scrollbar-hide {
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

"use client"

import { useRef, useState } from "react"
import { team } from "@/data/team"

export default function PeopleCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleScroll = () => {
    if (!containerRef.current) return

    const container = containerRef.current
    const scrollLeft = container.scrollLeft
    const cardWidth = container.offsetWidth

    const index = Math.round(scrollLeft / cardWidth)
    setActiveIndex(index)
  }

  const scrollTo = (index: number) => {
    if (!containerRef.current) return

    containerRef.current.scrollTo({
      left: containerRef.current.offsetWidth * index,
      behavior: "smooth",
    })
  }

  return (
    <section className="relative w-full bg-gradient-to-br from-blue-700 to-blue-900 py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-10 text-white">
          <h2 className="text-3xl font-bold">Powered by People</h2>
          <p className="mt-4 max-w-2xl text-sm text-blue-100">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Cards */}
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="
              flex gap-6 overflow-x-auto scroll-smooth
              snap-x snap-mandatory
              scrollbar-hide
            "
          >
            {team.map((person, index) => (
              <div
                key={person.name}
                className="
                  snap-center
                  min-w-full
                  md:min-w-[33.333%]
                "
              >
                <div className="rounded-xl bg-white p-6 shadow-lg">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="h-64 w-full rounded-lg object-cover"
                  />

                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-900">
                      {person.name}
                    </h3>
                    <p className="text-sm text-gray-500">{person.role}</p>
                  </div>

                  <button className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    Read more
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="mt-6 flex justify-center gap-3">
            {team.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`
                  h-2.5 w-2.5 rounded-full transition
                  ${
                    activeIndex === index
                      ? "bg-white scale-110"
                      : "bg-white/40 hover:bg-white/70"
                  }
                `}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


<div className="mt-6 flex justify-center gap-3 md:hidden">
