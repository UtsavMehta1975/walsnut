// Official-looking UPI App Logos matching real brand designs

export const PhonePeLogo = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    <defs>
      <linearGradient id="phonePeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#5F259F"/>
        <stop offset="100%" stopColor="#3C1A66"/>
      </linearGradient>
    </defs>
    {/* Background */}
    <rect width="120" height="120" rx="24" fill="url(#phonePeGrad)"/>
    
    {/* PhonePe iconic arrow/play symbol */}
    <g transform="translate(60, 40)">
      <path d="M -20 -15 L 20 0 L -20 15 L -20 10 L 10 0 L -20 -10 Z" fill="white"/>
    </g>
    
    {/* PhonePe text */}
    <text x="60" y="85" textAnchor="middle" fill="white" fontSize="18" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.5">
      PhonePe
    </text>
  </svg>
)

export const GooglePayLogo = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    {/* White background */}
    <rect width="120" height="120" rx="24" fill="white"/>
    <rect width="120" height="120" rx="24" fill="none" stroke="#E8EAED" strokeWidth="1"/>
    
    {/* Google G logo - official colors */}
    <g transform="translate(60, 35)">
      {/* Blue */}
      <path d="M 20 0 L 20 8 L 14 8 C 14 16 8 22 0 22 C -8 22 -14 16 -14 8 C -14 0 -8 -6 0 -6 C 4 -6 7 -5 9 -3 L 4 2 C 3 1 1 0 0 0 C -4 0 -7 3 -7 8 C -7 12 -4 15 0 15 C 5 15 7 11 7 8 L 7 6 L 0 6 L 0 0 L 20 0 Z" fill="#4285F4"/>
    </g>
    
    {/* GPay text */}
    <g transform="translate(30, 75)">
      <text x="0" y="0" fill="#3C4043" fontSize="22" fontWeight="500" fontFamily="Google Sans, system-ui, sans-serif">
        <tspan fill="#4285F4">G</tspan>
        <tspan fill="#0F9D58">o</tspan>
        <tspan fill="#F4B400">o</tspan>
        <tspan fill="#DB4437">g</tspan>
        <tspan fill="#4285F4">l</tspan>
        <tspan fill="#0F9D58">e</tspan>
      </text>
    </g>
    <text x="60" y="97" textAnchor="middle" fill="#5F6368" fontSize="18" fontWeight="500" fontFamily="system-ui, sans-serif">
      Pay
    </text>
  </svg>
)

export const PaytmLogo = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    <defs>
      <linearGradient id="paytmGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#00BAF2"/>
        <stop offset="100%" stopColor="#0084C7"/>
      </linearGradient>
    </defs>
    {/* Background */}
    <rect width="120" height="120" rx="24" fill="url(#paytmGrad)"/>
    
    {/* Paytm logo mark - simplified P */}
    <g transform="translate(60, 45)">
      <circle cx="0" cy="0" r="18" fill="white" opacity="0.95"/>
      <path d="M -5 -12 L -5 12 L 3 12 L 3 2 L 8 2 C 12 2 15 -1 15 -5 C 15 -9 12 -12 8 -12 Z M 3 -6 L 3 -2 L 7 -2 C 8.5 -2 10 -3.5 10 -5 C 10 -6.5 8.5 -6 7 -6 Z" fill="#00BAF2"/>
    </g>
    
    {/* Paytm text */}
    <text x="60" y="90" textAnchor="middle" fill="white" fontSize="20" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="1">
      Paytm
    </text>
  </svg>
)

export const GenericUPILogo = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    <defs>
      <linearGradient id="upiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#097939"/>
        <stop offset="100%" stopColor="#006428"/>
      </linearGradient>
    </defs>
    {/* Background - UPI official green */}
    <rect width="120" height="120" rx="24" fill="url(#upiGrad)"/>
    
    {/* UPI logo elements */}
    <g transform="translate(60, 50)">
      <circle cx="0" cy="0" r="22" fill="white" opacity="0.2"/>
      <text x="0" y="10" textAnchor="middle" fill="white" fontSize="28" fontWeight="700" fontFamily="system-ui, sans-serif">
        UPI
      </text>
    </g>
    
    {/* Subtitle */}
    <text x="60" y="95" textAnchor="middle" fill="white" fontSize="12" fontFamily="system-ui, sans-serif" opacity="0.95">
      All UPI Apps
    </text>
  </svg>
)

