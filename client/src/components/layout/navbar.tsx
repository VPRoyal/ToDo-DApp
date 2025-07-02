// src/components/layout/Navbar.tsx
import React from 'react';
import { useWeb3 } from '../../hooksOld/useWeb3';
// import WalletConnect from '../web3/WalletConnect';

const Navbar: React.FC = () => {
//   const { isConnected, address } = useWeb3();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Todo DApp
            </h1>
          </div>
          <div className="flex items-center">
            {/* <WalletConnect /> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;