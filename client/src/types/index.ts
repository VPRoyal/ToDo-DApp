// src/types/index.ts
import type { Eip1193Provider } from 'ethers';

interface ExtendedEip1193Provider extends Eip1193Provider {
  on?: (event: string, listener: (...args: any[]) => void) => void;
  removeListener?: (event: string, listener: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: ExtendedEip1193Provider;
  }
}


export interface Task {
  id: number;
  content: string;
  completed: boolean;
  timestamp: number;
}

export interface Web3State {
  provider: any;
  signer: any;
  address: string | null;
  chainId: number | null;
}

export interface TransactionStatus {
  hash: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
}