export default function FloralCorner({ className = "" }) {
  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* Large bloom */}
      <circle cx="20" cy="20" r="14" fill="#EBC8C8" opacity="0.35"/>
      <path d="M20 6 Q12 2 8 10 Q14 18 20 14Z" fill="#EBC8C8" opacity="0.5"/>
      <path d="M20 6 Q28 2 32 10 Q26 18 20 14Z" fill="#EBC8C8" opacity="0.5"/>
      <path d="M6 20 Q2 12 10 8 Q18 14 14 20Z" fill="#A8B8A2" opacity="0.5"/>
      <path d="M6 20 Q2 28 10 32 Q18 26 14 20Z" fill="#A8B8A2" opacity="0.5"/>
      <circle cx="20" cy="20" r="5" fill="#F6E6A8" opacity="0.8"/>

      {/* Small bud */}
      <circle cx="46" cy="14" r="7" fill="#AFC5D6" opacity="0.3"/>
      <circle cx="46" cy="14" r="3" fill="#AFC5D6" opacity="0.5"/>

      <circle cx="14" cy="46" r="7" fill="#AFC5D6" opacity="0.3"/>
      <circle cx="14" cy="46" r="3" fill="#AFC5D6" opacity="0.5"/>

      {/* Leaves */}
      <path d="M35 5 Q42 12 38 22 Q30 16 35 5Z" fill="#A8B8A2" opacity="0.4"/>
      <path d="M5 35 Q12 42 22 38 Q16 30 5 35Z" fill="#A8B8A2" opacity="0.4"/>
      <path d="M60 10 Q68 5 70 16 Q62 20 60 10Z" fill="#A8B8A2" opacity="0.3"/>
      <path d="M10 60 Q5 68 16 70 Q20 62 10 60Z" fill="#A8B8A2" opacity="0.3"/>

      {/* Corner line */}
      <path d="M0 0 L90 0 M0 0 L0 90"
            stroke="#C7B8A3" strokeWidth="0.8" opacity="0.4" fill="none"/>
    </svg>
  );
}