
import { Link } from 'react-router-dom';
import { Hotel, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-hotel-600">
              <Hotel className="h-6 w-6" />
              <span className="text-xl font-semibold">StayHaven</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Discover luxury accommodations tailored to your preferences. Experience comfort like never before with StayHaven.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-hotel-500 transition">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-hotel-500 transition">
                <Twitter size={18} />
              </a>
              <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-hotel-500 transition">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-hotel-500 transition">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-base mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-hotel-500 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="text-muted-foreground hover:text-hotel-500 transition">
                  Hotels
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-hotel-500 transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-hotel-500 transition">
                  About
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-hotel-500 transition">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-hotel-500 transition">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-medium text-base mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-hotel-500 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  123 Hotel Street, City Center, Country
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone size={18} className="text-hotel-500 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={18} className="text-hotel-500 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">info@stayhaven.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-medium text-base mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-hotel-500"
                required
              />
              <button
                type="submit"
                className="w-full rounded-md bg-hotel-500 px-3 py-2 text-sm font-medium text-white hover:bg-hotel-600 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-gray-200 text-center text-sm text-muted-foreground">
          <p>© {currentYear} StayHaven. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/terms" className="hover:text-hotel-500 transition">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-hotel-500 transition">
              Privacy Policy
            </Link>
            <Link to="/cookie" className="hover:text-hotel-500 transition">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
