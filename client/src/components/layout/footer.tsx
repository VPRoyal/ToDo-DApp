// src/components/layout/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 fixed bottom-0 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              © {new Date().getFullYear()} Todo DApp
            </span>
            <a 
              href="#" 
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Terms of Service
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* <NetworkStatus /> */}
            <div className="text-sm text-gray-500">
              Made with ❤️ by Your Name
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;