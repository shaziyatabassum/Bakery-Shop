import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Message sent successfully! We will contact you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container-custom py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-3">Contact Us</h1>
        <p className="text-gray-500">Have a custom cake inquiry or feedback? We'd love to hear from you!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Info Side */}
        <div className="space-y-8">
          <div className="bg-lightBackground p-6 rounded-xl border border-borderLight space-y-6">
            <h2 className="text-2xl font-bold text-primary">Delicious Bakery Shop</h2>
            <p className="text-gray-600">Freshly baking happiness since 2018. Pay us a visit or drop an inquiry.</p>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <FiMapPin className="text-primary text-xl mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-textMain">Address</h4>
                  <p className="text-sm text-gray-500">123 Bakers Street, Chocolate Lane, Bangalore, Karnataka - 560001</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <FiPhone className="text-primary text-xl mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-textMain">Phone Number</h4>
                  <p className="text-sm text-gray-500">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <FiMail className="text-primary text-xl mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-textMain">Email Address</h4>
                  <p className="text-sm text-gray-500">hello@deliciousbakery.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <FiClock className="text-primary text-xl mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-textMain">Working Hours</h4>
                  <p className="text-sm text-gray-500">Monday - Sunday: 08:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Map Placeholder */}
          <div className="h-64 bg-gray-100 rounded-xl border border-borderLight overflow-hidden flex items-center justify-center text-gray-400">
            <FiMapPin className="text-4xl mr-2 animate-bounce text-primary" />
            <span className="font-semibold">Bangalore Central Store Map Location</span>
          </div>
        </div>

        {/* Contact Form Side */}
        <div className="bg-white p-8 rounded-xl border border-borderLight shadow-sm h-fit">
          <h2 className="text-2xl font-bold text-primary mb-6">Send an Inquiry</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-borderLight rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-borderLight rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full border border-borderLight rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                placeholder="Custom cake request"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Message *</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full border border-borderLight rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                placeholder="Write your message here..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-accent text-white py-2.5 rounded-md font-semibold transition-colors text-sm shadow-sm"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
