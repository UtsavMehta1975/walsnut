// Real UPI App Logos as SVG components

export const PhonePeLogo = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full">
    <rect width="48" height="48" rx="8" fill="#5F259F"/>
    <text x="24" y="30" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial">
      PhonePe
    </text>
  </svg>
)

export const GooglePayLogo = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full">
    <rect width="48" height="48" rx="8" fill="white"/>
    <path d="M24 14v10h9.5c-.4 2.3-2.8 6.7-9.5 6.7-5.7 0-10.4-4.7-10.4-10.5S18.3 9.7 24 9.7c3.3 0 5.5 1.4 6.7 2.6l4.2-4.1C32.3 5.8 28.5 4 24 4c-8.8 0-16 7.2-16 16s7.2 16 16 16c9.2 0 15.3-6.5 15.3-15.6 0-1-.1-1.8-.2-2.6H24z" fill="#4285F4"/>
  </svg>
)

export const PaytmLogo = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full">
    <defs>
      <linearGradient id="paytmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00BAF2"/>
        <stop offset="100%" stopColor="#0082CA"/>
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="8" fill="url(#paytmGrad)"/>
    <text x="24" y="28" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">
      Paytm
    </text>
  </svg>
)

export const FamPayLogo = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full">
    <defs>
      <linearGradient id="fampayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700"/>
        <stop offset="100%" stopColor="#FFA500"/>
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="8" fill="url(#fampayGrad)"/>
    <text x="24" y="28" textAnchor="middle" fill="#000" fontSize="13" fontWeight="bold" fontFamily="Arial">
      FamPay
    </text>
  </svg>
)

export const BHIMLogo = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full">
    <rect width="48" height="48" rx="8" fill="#ED1C24"/>
    <path d="M12 18h10v2H12v-2zm0 4h10v2H12v-2zm0 4h10v2H12v-2z" fill="white"/>
    <path d="M26 18h10v12H26V18z" fill="white"/>
    <text x="24" y="33" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">
      BHIM
    </text>
  </svg>
)

export const GenericUPILogo = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full">
    <rect width="48" height="48" rx="8" fill="#000000"/>
    <text x="24" y="28" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial">
      UPI
    </text>
  </svg>
)

