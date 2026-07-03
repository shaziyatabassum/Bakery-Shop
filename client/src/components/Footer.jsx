import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiYoutube } from 'react-icons/fi';
import { FaPinterestP } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-lightBackground border-t border-borderLight pt-16 pb-8 mt-auto">
      <div className="container-custom grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
        {/* Help */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-6">Let Us Help You</h3>
          <ul className="space-y-3">
            <li><Link to="/contact" className="text-gray-600 hover:text-accent">Contact Us</Link></li>
            <li><Link to="/faqs" className="text-gray-600 hover:text-accent">FAQs</Link></li>
            <li><Link to="/shipping" className="text-gray-600 hover:text-accent">Shipping Policy</Link></li>
            <li><Link to="/returns" className="text-gray-600 hover:text-accent">Return Policy</Link></li>
            <li><Link to="/privacy" className="text-gray-600 hover:text-accent">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-gray-600 hover:text-accent">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact Details */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-6">Contact Details</h3>
          <ul className="space-y-3 text-gray-600">
            <li>123 Bakery Street, Sweet Town, NY 10001</li>
            <li>+1 (800) 123-4567</li>
            <li>hello@deliciousbakery.com</li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-6">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white flex-center text-primary shadow-sm hover:bg-primary hover:text-white transition-colors">
              <FiInstagram size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white flex-center text-primary shadow-sm hover:bg-primary hover:text-white transition-colors">
              <FiFacebook size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white flex-center text-primary shadow-sm hover:bg-primary hover:text-white transition-colors">
              <FaPinterestP size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white flex-center text-primary shadow-sm hover:bg-primary hover:text-white transition-colors">
              <FiYoutube size={20} />
            </a>
          </div>
        </div>
      </div>
      
      <div className="container-custom text-center border-t border-borderLight pt-8 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Delicious Bakery. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
