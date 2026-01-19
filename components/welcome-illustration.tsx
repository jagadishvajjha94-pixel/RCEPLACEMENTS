export function WelcomeIllustration() {
  return (
    <div className="relative w-full h-full flex items-end justify-center">
      {/* Woman with glasses illustration - positioned at bottom */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: 'translateY(10px)' }}
      >
        {/* Head */}
        <circle cx="100" cy="70" r="32" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="1.5" />
        
        {/* Hair */}
        <path
          d="M 72 70 Q 72 45, 100 45 Q 128 45, 128 70 Q 128 90, 100 90 Q 72 90, 72 70"
          fill="#1F2937"
        />
        
        {/* Glasses */}
        <circle cx="88" cy="70" r="7" fill="none" stroke="#374151" strokeWidth="2" />
        <circle cx="112" cy="70" r="7" fill="none" stroke="#374151" strokeWidth="2" />
        <line x1="95" y1="70" x2="105" y2="70" stroke="#374151" strokeWidth="2" />
        
        {/* Body/Torso */}
        <rect x="78" y="105" width="44" height="55" rx="4" fill="#D1D5DB" />
        
        {/* Laptop */}
        <rect x="73" y="130" width="54" height="30" rx="2" fill="#6B7280" />
        <rect x="78" y="135" width="44" height="20" rx="1.5" fill="#111827" />
        
        {/* Speech bubbles */}
        {/* Blue bubble - top right */}
        <ellipse cx="145" cy="55" rx="22" ry="18" fill="#3B82F6" opacity="0.85" />
        <path d="M 135 68 L 125 75 L 130 68 Z" fill="#3B82F6" opacity="0.85" />
        
        {/* Pink bubble - left side */}
        <ellipse cx="45" cy="95" rx="18" ry="14" fill="#EC4899" opacity="0.85" />
        <path d="M 55 105 L 48 112 L 52 105 Z" fill="#EC4899" opacity="0.85" />
      </svg>
    </div>
  )
}

