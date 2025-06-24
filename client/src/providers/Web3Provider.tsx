import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';

interface Web3ContextType {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  address: string | null;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const Web3Context = createContext<Web3ContextType | null>(null);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

const connect = async () => {
  if (isConnecting || !window.ethereum) return;
  setIsConnecting(true);

  try {
    const browserProvider = new BrowserProvider(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' }); // avoid duplicate calls
    const signer = await browserProvider.getSigner();
    const address = await signer.getAddress();
    const network = await browserProvider.getNetwork();

    setProvider(browserProvider);
    setSigner(signer);
    setAddress(address);
    setChainId(Number(network.chainId));
  } catch (error: any) {
    if (error.code === -32002) {
      console.warn('Connection request already pending. Prompt user to check MetaMask.');
    } else {
      console.error('Error connecting to MetaMask', error);
    }
  } finally {
    console.log('Connection attempt finished');
    setIsConnecting(false);
  }
};

  const disconnect = () => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setChainId(null);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum?.on?.('accountsChanged', connect);
      window.ethereum?.on?.('chainChanged', () => window.location.reload());
    }
    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', connect);
        window.ethereum.removeListener('chainChanged', () => window.location.reload());
      }
    };
  }, []);

  return (
    <Web3Context.Provider value={{ provider, signer, address, chainId, connect, disconnect }}>
      {children}
    </Web3Context.Provider>
  );
};