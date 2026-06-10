export default function FloralBorder({ position = "top" }) {
  return (
    <div
      aria-hidden="true"
      className={`w-full flex justify-center pointer-events-none select-none
        ${position === "top"    ? "mb-4" : ""}
        ${position === "bottom" ? "mt-4" : ""}
      `}
    >
      <svg
        viewBox="0 0 600 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-2xl opacity-70"
      >
        {/* Center flourish */}
        <path d="M300 40 C280 20 260 30 240 40 C260 50 280 60 300 40Z" fill="#EBC8C8" opacity="0.6"/>
        <path d="M300 40 C320 20 340 30 360 40 C340 50 320 60 300 40Z" fill="#EBC8C8" opacity="0.6"/>
        <circle cx="300" cy="40" r="6" fill="#C7B8A3"/>

        {/* Left florals */}
        <circle cx="220" cy="38" r="10" fill="#A8B8A2" opacity="0.4"/>
        <path   d="M220 28 Q215 20 208 24 Q212 32 220 28Z" fill="#A8B8A2" opacity="0.5"/>
        <path   d="M220 28 Q225 20 232 24 Q228 32 220 28Z" fill="#EBC8C8" opacity="0.5"/>
        <circle cx="220" cy="38" r="4" fill="#F6E6A8" opacity="0.7"/>

        <circle cx="160" cy="42" r="8" fill="#AFC5D6" opacity="0.35"/>
        <circle cx="160" cy="42" r="3" fill="#C7B8A3" opacity="0.5"/>

        <path d="M100 40 Q90 25 80 35 Q90 48 100 40Z" fill="#EBC8C8" opacity="0.4"/>
        <path d="M100 40 Q110 25 120 35 Q110 48 100 40Z" fill="#A8B8A2" opacity="0.4"/>
        <circle cx="100" cy="40" r="4" fill="#F6E6A8" opacity="0.6"/>

        {/* Right florals (mirror) */}
        <circle cx="380" cy="38" r="10" fill="#A8B8A2" opacity="0.4"/>
        <path   d="M380 28 Q375 20 368 24 Q372 32 380 28Z" fill="#A8B8A2" opacity="0.5"/>
        <path   d="M380 28 Q385 20 392 24 Q388 32 380 28Z" fill="#EBC8C8" opacity="0.5"/>
        <circle cx="380" cy="38" r="4" fill="#F6E6A8" opacity="0.7"/>

        <circle cx="440" cy="42" r="8" fill="#AFC5D6" opacity="0.35"/>
        <circle cx="440" cy="42" r="3" fill="#C7B8A3" opacity="0.5"/>

        <path d="M500 40 Q490 25 480 35 Q490 48 500 40Z" fill="#EBC8C8" opacity="0.4"/>
        <path d="M500 40 Q510 25 520 35 Q510 48 500 40Z" fill="#A8B8A2" opacity="0.4"/>
        <circle cx="500" cy="40" r="4" fill="#F6E6A8" opacity="0.6"/>

        {/* Connecting vine */}
        <path d="M60 40 Q180 35 240 40 Q260 42 300 40 Q340 38 360 40 Q420 45 540 40"
              stroke="#C7B8A3" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" fill="none"/>
      </svg>
    </div>
  );
}