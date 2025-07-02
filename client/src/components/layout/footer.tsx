// src/components/layout/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 w-full py-2 justify-self-end dark:bg-background">
      <div className=" sm:px-6 py-2">
        <div className="flex justify-between items-center px-10 pr-15">
          <div className="flex items-center space-x-4 dark:text-foreground">
            <span className="text-sm text-gray-500 dark:text-foreground ">
              © {new Date().getFullYear()} Todo DApp
            </span>
            <a 
              href="#" 
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-foreground"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-foreground"
            >
              Terms of Service
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* <NetworkStatus /> */}
            <div className="text-lg text-chart-3 font-mono font-extrabold">
              Made with ❤️ by VP Singh
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;