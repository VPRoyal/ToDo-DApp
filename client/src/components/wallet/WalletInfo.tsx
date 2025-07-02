"use client"

import { useState } from "react"
import { Button } from "@/components/common/button"
import { Badge } from "@/components/common/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/common/dropdown-menu"
import { Copy, ExternalLink, LogOut, Wallet, ChevronDown } from "lucide-react"
import { useWallet } from "@/context/walletProvider"
import { toast } from "react-hot-toast"

const NETWORK_NAMES: { [key: number]: string } = {
  1: "Ethereum Mainnet",
  5: "Goerli Testnet",
  11155111: "Sepolia Testnet",
  137: "Polygon Mainnet",
  80001: "Polygon Mumbai",
  56: "BSC Mainnet",
  97: "BSC Testnet",
}

export function WalletInfo() {
  const { account, balance, chainId, disconnect, switchNetwork } = useWallet()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  if (!account) return null

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatBalance = (balance: string | null) => {
    if (!balance) return "0.00"
    const num = Number.parseFloat(balance)
    return num.toFixed(4)
  }

  const copyAddress = async () => {
    if (account) {
      await navigator.clipboard.writeText(account)
      toast.success("Address copied to clipboard")
    }
  }

  const openEtherscan = () => {
    if (account && chainId) {
      const baseUrl = chainId === 1 ? "https://etherscan.io" : "https://goerli.etherscan.io"
      window.open(`${baseUrl}/address/${account}`, "_blank")
    }
  }

  const handleSwitchToMainnet = () => {
    switchNetwork(1)
  }

  const networkName = chainId ? NETWORK_NAMES[chainId] || `Chain ${chainId}` : "Unknown"
  const isMainnet = chainId === 1

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="hidden sm:inline">{formatAddress(account)}</span>
            <span className="sm:hidden">
              <Wallet className="h-4 w-4" />
            </span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <div className="p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Connected Wallet</span>
            <Badge variant={isMainnet ? "default" : "secondary"} className="text-xs">
              {networkName}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Address</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-mono">{formatAddress(account)}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyAddress}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Balance</span>
              <span className="text-sm font-medium">{formatBalance(balance)} ETH</span>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={copyAddress}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Address
        </DropdownMenuItem>

        <DropdownMenuItem onClick={openEtherscan}>
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>

        {!isMainnet && (
          <DropdownMenuItem onClick={handleSwitchToMainnet}>
            <Wallet className="mr-2 h-4 w-4" />
            Switch to Mainnet
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={disconnect} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
