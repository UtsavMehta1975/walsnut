'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

interface OTPVerificationProps {
  email?: string
  phone?: string
  type: 'EMAIL' | 'PHONE'
  purpose?: string
  onVerified: () => void
  onCancel?: () => void
}

export function OTPVerification({ 
  email, 
  phone, 
  type, 
  purpose = 'SIGNUP',
  onVerified,
  onCancel 
}: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(60) // 1 minute cooldown
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setError('OTP expired. Please request a new one.')
    }
  }, [timeLeft])

  // Resend cooldown
  useEffect(() => {
    if (resendCooldown > 0 && !canResend) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (resendCooldown === 0) {
      setCanResend(true)
    }
  }, [resendCooldown, canResend])

  // Auto-focus first input
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-verify when all 6 digits are entered
    if (newOtp.every(digit => digit !== '') && value) {
      handleVerify(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      navigator.clipboard.readText().then(text => {
        const pastedOtp = text.replace(/\D/g, '').slice(0, 6).split('')
        const newOtp = [...otp]
        pastedOtp.forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit
        })
        setOtp(newOtp)
        if (pastedOtp.length === 6) {
          handleVerify(newOtp.join(''))
        }
      })
    }
  }

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join('')
    
    if (code.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    setIsVerifying(true)
    setError('')

    try {
      const response = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: type === 'EMAIL' ? email : undefined,
          phone: type === 'PHONE' ? phone : undefined,
          otp: code,
          type
        })
      })

      const data = await response.json()

      if (response.ok && data.verified) {
        toast.success('✅ Verified successfully!')
        onVerified()
      } else {
        setError(data.error || 'Invalid OTP')
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
        
        if (data.remainingAttempts === 0) {
          setError('Maximum attempts exceeded. Please request a new OTP.')
        }
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      setError('Failed to verify OTP. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return

    setIsSending(true)
    setError('')
    setOtp(['', '', '', '', '', ''])

    try {
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: type === 'EMAIL' ? email : undefined,
          phone: type === 'PHONE' ? phone : undefined,
          type,
          purpose
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`✅ New OTP sent to your ${type.toLowerCase()}`)
        setTimeLeft(300) // Reset timer
        setCanResend(false)
        setResendCooldown(60) // Reset cooldown
        inputRefs.current[0]?.focus()
      } else {
        setError(data.error || 'Failed to resend OTP')
      }
    } catch (error) {
      console.error('Resend OTP error:', error)
      setError('Failed to resend OTP. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verify Your {type === 'EMAIL' ? 'Email' : 'Phone'}
        </h2>
        <p className="text-gray-600 text-sm">
          We've sent a 6-digit code to<br />
          <span className="font-semibold text-gray-900">
            {type === 'EMAIL' ? email : phone}
          </span>
        </p>
      </div>

      {/* OTP Input */}
      <div className="flex justify-center gap-2 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => { inputRefs.current[index] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            className={`
              w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all
              ${error ? 'border-red-500' : 'border-gray-300'}
              ${digit ? 'border-yellow-500 bg-yellow-50' : 'bg-white'}
            `}
            disabled={isVerifying}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Timer */}
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600">
          {timeLeft > 0 ? (
            <>Time remaining: <span className="font-semibold text-gray-900">{formatTime(timeLeft)}</span></>
          ) : (
            <span className="text-red-600 font-semibold">OTP Expired</span>
          )}
        </p>
      </div>

      {/* Verify Button */}
      <Button
        onClick={() => handleVerify()}
        disabled={otp.some(digit => !digit) || isVerifying || timeLeft === 0}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 mb-4"
      >
        {isVerifying ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Verify OTP
          </>
        )}
      </Button>

      {/* Resend OTP */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          Didn't receive the code?
        </p>
        <Button
          onClick={handleResend}
          disabled={!canResend || isSending}
          variant="ghost"
          className="text-yellow-600 hover:text-yellow-700 font-semibold"
        >
          {isSending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : canResend ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Resend OTP
            </>
          ) : (
            <>Resend in {resendCooldown}s</>
          )}
        </Button>
      </div>

      {/* Cancel */}
      {onCancel && (
        <div className="text-center mt-4">
          <Button
            onClick={onCancel}
            variant="ghost"
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}

