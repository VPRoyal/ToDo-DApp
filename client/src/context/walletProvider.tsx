"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import  { type Eip1193Provider, ethers } from "ethers"

interface ExtendedEip1193Provider extends Eip1193Provider {
    isCoinbaseWallet?: boolean
  on?: (event: string, listener: (...args: any[]) => void) => void;
  removeListener?: (event: string, listener: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: ExtendedEip1193Provider;
  }
}
interface WalletContextType {
  account: string | null
  balance: string | null
  chainId: number | null
  isConnecting: boolean
  error: string | null
  connectMetaMask: () => Promise<void>
  connectCoinbase: () => Promise<void>
  disconnect: () => void
  switchNetwork: (chainId: number) => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)


interface WalletProviderProps {
  children: ReactNode
}

export const WalletProvider=({ children }: WalletProviderProps)=> {
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if wallet is already connected on page load
  useEffect(() => {
    checkConnection()
  }, [])

  // Listen for account changes
 useEffect(() => {
  if (typeof window === "undefined" || !window.ethereum) return

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect()
    } else {
      setAccount(accounts[0])
      getBalance(accounts[0])
    }
  }

  const handleChainChanged = (chainId: string) => {
    setChainId(Number.parseInt(chainId, 16))
  }

  const handleDisconnect = () => {
    disconnect()
  }

  window.ethereum.on?.("accountsChanged", handleAccountsChanged)
  window.ethereum.on?.("chainChanged", handleChainChanged)
  window.ethereum.on?.("disconnect", handleDisconnect)

  return () => {
    window.ethereum?.removeListener?.("accountsChanged", handleAccountsChanged)
    window.ethereum?.removeListener?.("chainChanged", handleChainChanged)
    window.ethereum?.removeListener?.("disconnect", handleDisconnect)
  }
}, [])


  const checkConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setAccount(accounts[0])
          await getBalance(accounts[0])
          const chainId = await window.ethereum.request({ method: "eth_chainId" })
          setChainId(Number.parseInt(chainId, 16))
        }
      } catch (error) {
        console.error("Error checking connection:", error)
      }
    }
  }

  const getBalance = async (address: string) => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const balance = await provider.getBalance(address)
        setBalance(ethers.formatEther(balance))
      }
    } catch (error) {
      console.error("Error getting balance:", error)
    }
  }

  const connectMetaMask = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setError("MetaMask is not installed. Please install MetaMask to continue.")
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        setAccount(accounts[0])
        await getBalance(accounts[0])

        // Get chain ID
        const chainId = await window.ethereum.request({ method: "eth_chainId" })
        setChainId(Number.parseInt(chainId, 16))
      }
    } catch (error: any) {
      if (error.code === 4001) {
        setError("Connection rejected by user")
      } else {
        setError("Failed to connect to MetaMask")
      }
      console.error("MetaMask connection error:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const connectCoinbase = async () => {
    if (typeof window === "undefined") {
      setError("Coinbase Wallet is not available")
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      // Check if Coinbase Wallet is available
      if (window.ethereum && window.ethereum.isCoinbaseWallet) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })

        if (accounts.length > 0) {
          setAccount(accounts[0])
          await getBalance(accounts[0])

          const chainId = await window.ethereum.request({ method: "eth_chainId" })
          setChainId(Number.parseInt(chainId, 16))
        }
      } else {
        // Redirect to Coinbase Wallet if not installed
        setError("Coinbase Wallet is not installed. Redirecting to install page...")
        setTimeout(() => {
          window.open("https://www.coinbase.com/wallet", "_blank")
        }, 2000)
      }
    } catch (error: any) {
      if (error.code === 4001) {
        setError("Connection rejected by user")
      } else {
        setError("Failed to connect to Coinbase Wallet")
      }
      console.error("Coinbase Wallet connection error:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAccount(null)
    setBalance(null)
    setChainId(null)
    setError(null)
  }

  const switchNetwork = async (targetChainId: number) => {
    if (typeof window === "undefined" || !window.ethereum) {
      setError("No wallet detected")
      return
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      })
    } catch (error: any) {
      if (error.code === 4902) {
        // Network not added to wallet
        setError("Network not found in wallet. Please add it manually.")
      } else {
        setError("Failed to switch network")
      }
      console.error("Network switch error:", error)
    }
  }

  const value: WalletContextType = {
    account,
    balance,
    chainId,
    isConnecting,
    error,
    connectMetaMask,
    connectCoinbase,
    disconnect,
    switchNetwork,
  }
  
  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}


export const useWallet=()=> {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}