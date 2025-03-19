
import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Hotel className="h-6 w-6 text-hotel-600" />
              <span className="text-xl font-semibold text-hotel-600">StayHaven</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Find your perfect stay with our curated selection of hotels, resorts, and vacation rentals around the world.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-hotel-500 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-hotel-500 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-hotel-500 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-hotel-500 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-hotel-500 text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="text-muted-foreground hover:text-hotel-500 text-sm transition-colors">
                  Hotels
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-hotel-500 text-sm transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-hotel-500 text-sm transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-medium text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-hotel-500 text-sm transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-hotel-500 text-sm transition-colors">
                  Cancellation Options
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-hotel-500 text-sm transition-colors">
                  Safety Information
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-hotel-500 text-sm transition-colors">
                  Report Concern
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-medium text-lg mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-hotel-500 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  123 Hotel Street, New York, NY 10001, USA
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-hotel-500" />
                <span className="text-sm text-muted-foreground">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-hotel-500" />
                <span className="text-sm text-muted-foreground">contact@stayhaven.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} StayHaven. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-hotel-500 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-hotel-500 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-hotel-500 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
