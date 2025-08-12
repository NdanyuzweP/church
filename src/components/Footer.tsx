import React from 'react';
import { MapPin, Phone, Mail, Youtube, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Church Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="font-bold ">
                <div>Reformation Baptist</div>
                <div className="text-sm text-accent-500">Church of Kigali</div>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Proclaiming the Gospel in Rwanda through expository preaching, 
              reformed theology, and biblical community.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-accent-500">Contact</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-accent-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Kigali, Rwanda</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-accent-500 flex-shrink-0" />
                <span className="text-gray-300">+250 788 123 456</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-accent-500 flex-shrink-0" />
                <span className="text-gray-300">info@rbckigali.org</span>
              </div>
            </div>
          </div>

          {/* Service Times */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-accent-500">Service Times</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <Clock className="h-4 w-4 text-accent-500 mt-0.5 flex-shrink-0" />
                <div className="text-gray-300">
                  <div className="font-medium">Sunday Worship</div>
                  <div>9:00 AM - 11:00 AM</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="h-4 w-4 text-accent-500 mt-0.5 flex-shrink-0" />
                <div className="text-gray-300">
                  <div className="font-medium">Bible Study</div>
                  <div>Wednesday 7:00 PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-accent-500">Connect</h3>
            <div className="space-y-2">
              <a
                href="https://youtube.com/@reformationbaptistchurchkigali"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-300 hover:text-accent-500 transition-colors duration-200"
              >
                <Youtube className="h-4 w-4" />
                <span>YouTube Channel</span>
              </a>
              <a
                href="/admin/login"
                className="text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                Admin Portal
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Reformation Baptist Church of Kigali. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;