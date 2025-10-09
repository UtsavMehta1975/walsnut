// Exact replicas of official UPI App Logos
// References: 
// PhonePe: https://uxwing.com/phonepe-icon/
// Google Pay: https://uxwing.com/google-pay-icon/
// Paytm: https://www.vecteezy.com/free-png/paytm-logo

export const PhonePeLogo = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    {/* Official PhonePe purple background */}
    <rect width="120" height="120" rx="26" fill="#5F259F"/>
    
    {/* PhonePe's signature white arrow/triangle pointing right */}
    <g transform="translate(60, 60)">
      {/* Main triangle/arrow shape */}
      <path 
        d="M -18 -24 L 24 0 L -18 24 Z" 
        fill="white"
      />
      {/* Inner cutout to create the arrow effect */}
      <path 
        d="M -10 -16 L 12 0 L -10 16 Z" 
        fill="#5F259F"
      />
    </g>
  </svg>
)

export const GooglePayLogo = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    {/* White background */}
    <rect width="120" height="120" rx="26" fill="white"/>
    
    {/* Google Pay distinctive stripe design with official colors */}
    <g transform="translate(60, 60)">
      {/* Blue stripe */}
      <rect x="-35" y="-20" width="70" height="8" rx="4" fill="#4285F4"/>
      
      {/* Green stripe */}
      <rect x="-35" y="-6" width="70" height="8" rx="4" fill="#34A853"/>
      
      {/* Yellow stripe */}
      <rect x="-35" y="8" width="70" height="8" rx="4" fill="#FBBC04"/>
      
      {/* Red stripe (shorter) */}
      <rect x="-35" y="22" width="45" height="8" rx="4" fill="#EA4335"/>
    </g>
  </svg>
)

export const PaytmLogo = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    {/* Official Paytm light blue background */}
    <rect width="120" height="120" rx="26" fill="#00BAF2"/>
    
    {/* Paytm's iconic white circle with "P" checkmark */}
    <g transform="translate(60, 60)">
      {/* White circle background */}
      <circle cx="0" cy="0" r="32" fill="white"/>
      
      {/* Blue "P" with checkmark integrated */}
      <g transform="translate(-8, -18)">
        {/* P stem */}
        <rect x="0" y="0" width="6" height="36" rx="1" fill="#00BAF2"/>
        
        {/* P top arc */}
        <path 
          d="M 6 6 L 6 0 L 18 0 C 22 0 26 4 26 8 C 26 12 22 16 18 16 L 6 16 Z" 
          fill="#00BAF2"
        />
        
        {/* Checkmark inside P */}
        <path 
          d="M 10 20 L 14 24 L 22 12" 
          stroke="#00BAF2" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </g>
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

