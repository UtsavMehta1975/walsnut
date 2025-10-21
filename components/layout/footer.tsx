import Link from 'next/link'
import { Mail, Phone, MapPin, Clock, Instagram } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="text-yellow-400 text-2xl font-abril font-bold mb-4">TheWalnutStore.in</h3>
            <p className="text-gray-300 mb-4">
              Premium inspired timepieces for the discerning collector. Quality craftsmanship meets timeless elegance.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/thewalnutstore.in?igsh=MWZyaW5uajdkeGozaQ==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-yellow-400 transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href="https://wa.me/917466965196" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links and Customer Services - Side by side on mobile */}
          <div className="grid grid-cols-2 gap-8 md:col-span-1 lg:col-span-2">
            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-yellow-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/watches" className="text-gray-300 hover:text-yellow-400 transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/watches?category=for-him" className="text-gray-300 hover:text-yellow-400 transition-colors">
                    For Him
                  </Link>
                </li>
                <li>
                  <Link href="/watches/for-her" className="text-gray-300 hover:text-yellow-400 transition-colors">
                    For Her
                  </Link>
                </li>
                <li>
                  <Link href="/sunglasses" className="text-gray-300 hover:text-yellow-400 transition-colors">
                    Signature Eyewear
                  </Link>
                </li>
                <li>
                  <Link href="/speakers" className="text-gray-300 hover:text-yellow-400 transition-colors">
                    Elite Speakers
                  </Link>
                </li>
                <li>
                  <Link href="/earbuds" className="text-gray-300 hover:text-yellow-400 transition-colors">
                    True Wireless Earbuds
                  </Link>
                </li>
                <li>
                  <Link href="/reviews" className="text-gray-300 hover:text-yellow-400 transition-colors">
                    Reviews
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Services */}
            <div>
              <h4 className="text-white font-semibold mb-4">Customer Services</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/shipping" className="text-gray-300 hover:text-yellow-400 transition-colors">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="text-gray-300 hover:text-yellow-400 transition-colors">
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/warranty" className="text-gray-300 hover:text-yellow-400 transition-colors">
                    Warranty
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-gray-300 hover:text-yellow-400 transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-yellow-400" />
                <a 
                  href="mailto:thewalnutstore01@gmail.com" 
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  thewalnutstore01@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-yellow-400" />
                <a 
                  href="tel:+917466965196" 
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  +91 74669 65196
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-yellow-400" />
                <span className="text-gray-300">Mumbai, India</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-yellow-400" />
                <span className="text-gray-300">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © {currentYear} TheWalnutStore.in. All Rights Reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy-policy" className="text-gray-300 hover:text-yellow-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-gray-300 hover:text-yellow-400 text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

