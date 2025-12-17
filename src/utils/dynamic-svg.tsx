import React from "react";

type SvgTextProps = {
  text: string;
  color?: string;          // fill color
  strokeColor?: string;    // stroke color
  strokeWidth?: number;
  className?: string;      // tailwind classes
};

const SvgText: React.FC<SvgTextProps> = ({
  text,
  color = "#000",
  strokeColor = "transparent",
  strokeWidth = 0,
  className = "",
}) => {
  return (
    <svg
      viewBox="0 0 1000 200"
      className={`w-full h-auto ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill={color}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        className="font-bold"
        style={{
          fontSize: "160px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {text}
      </text>
    </svg>
  );
};

export default SvgText;




import SvgText from "@/components/SvgText";

export default function Example() {
  return (
    <div className="space-y-10 p-10">
      {/* Simple */}
      <SvgText text="2025" color="#2563eb" />

      {/* Stroke + Fill */}
      <SvgText
        text="2024"
        color="white"
        strokeColor="#ef4444"
        strokeWidth={6}
        className="max-w-lg"
      />

      {/* Date format */}
      <SvgText
        text="09/2026"
        color="#22c55e"
        className="max-w-xl"
      />
    </div>
  );
}


@keyframes draw {
  from {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
  }
  to {
    stroke-dashoffset: 0;
  }
}

style={{
  fontSize: "160px",
  fontFamily: "Inter, sans-serif",
  strokeDasharray: 1000,
  animation: "draw 2s ease-out forwards",
}}