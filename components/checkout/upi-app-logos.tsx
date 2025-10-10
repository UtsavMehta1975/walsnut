// Official UPI App Logos - Using Real Images
// Images located in /public directory

import Image from 'next/image'

export const PhonePeLogo = () => (
  <div className="w-full h-full relative bg-white rounded-2xl overflow-hidden">
    <Image 
      src="/phonepe-icon.webp"
      alt="PhonePe"
      fill
      className="object-contain p-2"
      unoptimized
    />
  </div>
)

export const GooglePayLogo = () => (
  <div className="w-full h-full relative bg-white rounded-2xl overflow-hidden">
    <Image 
      src="/google-pay-icon.webp"
      alt="Google Pay"
      fill
      className="object-contain p-2"
      unoptimized
    />
  </div>
)

export const PaytmLogo = () => (
  <div className="w-full h-full relative bg-white rounded-2xl overflow-hidden">
    <Image 
      src="/paytmlogo.png"
      alt="Paytm"
      fill
      className="object-contain p-2"
      unoptimized
    />
  </div>
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

