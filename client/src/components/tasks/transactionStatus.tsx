"use client"

import { Alert, AlertDescription } from "@/components/common/alert"
import { Button } from "@/components/common/button"
import { Badge } from "@/components/common/badge"
import { Loader2, ExternalLink, CheckCircle, XCircle } from "lucide-react"

interface TransactionStatusProps {
  isLoading: boolean
  txHash: string | null
  error: string | null
  onDismiss?: () => void
}

const TransactionStatus=({ isLoading, txHash, error, onDismiss }: TransactionStatusProps)=> {
  if (!isLoading && !txHash && !error) return null

  const openEtherscan = () => {
    if (txHash) {
      window.open(`https://etherscan.io/tx/${txHash}`, "_blank")
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      {error && (
        <Alert variant="destructive" className="mb-2">
          <XCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            {onDismiss && (
              <Button variant="ghost" size="sm" onClick={onDismiss}>
                ×
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <Alert className="mb-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>Transaction pending...</span>
              {txHash && (
                <Button variant="ghost" size="sm" onClick={openEtherscan}>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
            </div>
            {txHash && (
              <div className="mt-1">
                <Badge variant="outline" className="text-xs font-mono">
                  {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </Badge>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && txHash && !error && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span className="text-green-800 dark:text-green-200">Transaction confirmed!</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={openEtherscan}>
                  <ExternalLink className="h-3 w-3" />
                </Button>
                {onDismiss && (
                  <Button variant="ghost" size="sm" onClick={onDismiss}>
                    ×
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-1">
              <Badge variant="outline" className="text-xs font-mono">
                {txHash.slice(0, 10)}...{txHash.slice(-8)}
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default TransactionStatus
