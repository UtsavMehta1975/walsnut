// Realistic UPI App Logos matching official brand designs

export const PhonePeLogo = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <linearGradient id="phonePeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5F259F"/>
        <stop offset="100%" stopColor="#3E1B6B"/>
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="12" fill="url(#phonePeGrad)"/>
    <circle cx="32" cy="26" r="10" fill="white" opacity="0.2"/>
    <path d="M32 20 L32 32 L38 26 Z" fill="white"/>
    <text x="32" y="48" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="system-ui">
      PhonePe
    </text>
  </svg>
)

export const GooglePayLogo = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <rect width="64" height="64" rx="12" fill="white"/>
    <g transform="translate(16, 16)">
      <path d="M16 8v12h11.5c-.5 2.8-3.4 8.1-11.5 8.1C8.5 28.1 2 21.6 2 14S8.5 0 16 0c4 0 6.7 1.7 8.2 3.2l5.1-4.9C26.3 -4 21.4-6 16-6c-10.6 0-19.3 8.6-19.3 19.3S5.4 32.6 16 32.6c11.1 0 18.5-7.8 18.5-18.8 0-1.3-.1-2.2-.3-3.1H16z" fill="#4285F4"/>
      <path d="M0 14.5c0 3.7 1.4 7.1 3.6 9.7l5.1-4.2c-1.4-1.4-2.3-3.4-2.3-5.5 0-2.1.8-4.1 2.3-5.5L3.6 4.8C1.4 7.4 0 10.8 0 14.5z" fill="#34A853"/>
      <path d="M16 6.4c2 0 3.7.7 5.1 2.1l3.8-3.8C22.3 2.1 19.4.6 16 .6 10.1.6 5 4 2.6 9l5.1 4.2C9.2 9.4 12.3 6.4 16 6.4z" fill="#FBBC04"/>
      <path d="M16 28.1c3.4 0 6.3-1.1 8.4-3l-4.1-3.4c-1.1.7-2.5 1.2-4.3 1.2-3.3 0-6.1-2.2-7.1-5.2l-5.1 4.2C5.8 26.1 10.6 28.1 16 28.1z" fill="#EA4335"/>
    </g>
  </svg>
)

export const PaytmLogo = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <linearGradient id="paytmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00BAF2"/>
        <stop offset="50%" stopColor="#0099D8"/>
        <stop offset="100%" stopColor="#0082CA"/>
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="12" fill="url(#paytmGrad)"/>
    <g transform="translate(8, 18)">
      <rect x="0" y="0" width="4" height="20" rx="2" fill="white"/>
      <rect x="6" y="4" width="4" height="16" rx="2" fill="white"/>
      <rect x="12" y="0" width="4" height="20" rx="2" fill="white"/>
      <rect x="18" y="8" width="4" height="12" rx="2" fill="white"/>
      <rect x="24" y="0" width="4" height="20" rx="2" fill="white"/>
      <rect x="30" y="4" width="4" height="16" rx="2" fill="white"/>
      <rect x="36" y="8" width="4" height="12" rx="2" fill="white"/>
      <rect x="42" y="0" width="4" height="20" rx="2" fill="white"/>
    </g>
    <text x="32" y="54" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="system-ui" letterSpacing="1">
      PAYTM
    </text>
  </svg>
)

export const GenericUPILogo = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <linearGradient id="upiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B35"/>
        <stop offset="100%" stopColor="#F7931E"/>
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="12" fill="url(#upiGrad)"/>
    <text x="32" y="28" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="system-ui">
      UPI
    </text>
    <text x="32" y="44" textAnchor="middle" fill="white" fontSize="8" fontFamily="system-ui" opacity="0.9">
      All Apps
    </text>
  </svg>
)

