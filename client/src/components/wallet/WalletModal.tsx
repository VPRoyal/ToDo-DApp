"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/common/dialog"
import { Button } from "@/components/common/button"
import { Alert, AlertDescription } from "@/components/common/alert"
import { Loader2, Wallet, AlertCircle } from "lucide-react"
import { useWallet } from "@/context/walletProvider"

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connectMetaMask, connectCoinbase, isConnecting, error } = useWallet()

  const handleMetaMaskConnect = async () => {
    await connectMetaMask()
    if (!error) {
      onClose()
    }
  }

  const handleCoinbaseConnect = async () => {
    await connectCoinbase()
    if (!error) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleMetaMaskConnect}
              disabled={isConnecting}
              className="w-full justify-start h-12 bg-transparent"
              variant="outline"
            >
              {isConnecting ? (
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              ) : (
                <div className="mr-3 h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
              )}
              <div className="text-left">
                <div className="font-medium">MetaMask</div>
                <div className="text-sm text-muted-foreground">Connect using browser wallet</div>
              </div>
            </Button>

            <Button
              onClick={handleCoinbaseConnect}
              disabled={isConnecting}
              className="w-full justify-start h-12 bg-transparent"
              variant="outline"
            >
              {isConnecting ? (
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              ) : (
                <div className="mr-3 h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
              )}
              <div className="text-left">
                <div className="font-medium">Coinbase Wallet</div>
                <div className="text-sm text-muted-foreground">Connect using Coinbase Wallet</div>
              </div>
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            By connecting a wallet, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
