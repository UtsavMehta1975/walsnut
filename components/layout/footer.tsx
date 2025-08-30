import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl lato-bold text-gradient-walnut">Walnut</span>
            </div>
            <p className="text-gray-200 mb-6 max-w-md">
              Where timeless design is naturally crafted. Precision-crafted homage timepieces 
              rooted in the legacy of iconic design, finished with organic precision.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/watches" className="text-gray-200 hover:text-yellow-400 transition-colors duration-300 font-medium">
                  All Watches
                </Link>
              </li>
              <li>
                <Link href="/brands" className="text-gray-200 hover:text-yellow-400 transition-colors duration-300 font-medium">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-200 hover:text-yellow-400 transition-colors duration-300 font-medium">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-200 hover:text-yellow-400 transition-colors duration-300 font-medium">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/craftsmanship" className="text-gray-200 hover:text-yellow-400 transition-colors duration-300 font-medium">
                  Craftsmanship
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="text-gray-200 hover:text-yellow-400 transition-colors duration-300 font-medium">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-gray-200 hover:text-yellow-400 transition-colors duration-300 font-medium">
                  Warranty
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-200 hover:text-yellow-400 transition-colors duration-300 font-medium">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-200 hover:text-yellow-400 transition-colors duration-300 font-medium">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Links */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/privacy-policy" className="text-gray-200 hover:text-yellow-400 transition-colors duration-300 font-medium">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-gray-200 hover:text-yellow-400 transition-colors duration-300 font-medium">
              Terms of Service
            </Link>
            <Link href="/refund-policy" className="text-gray-200 hover:text-yellow-400 transition-colors duration-300 font-medium">
              Refund Policy
            </Link>
            <Link href="/shipping-policy" className="text-gray-200 hover:text-yellow-400 transition-colors duration-300 font-medium">
              Shipping Policy
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-yellow-400" />
              <span className="text-gray-200">info@walnut.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-yellow-400" />
              <span className="text-gray-200">+91 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-yellow-400" />
              <span className="text-gray-200">Mumbai, India</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-200 text-sm">
            © 2024 Walnut. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

