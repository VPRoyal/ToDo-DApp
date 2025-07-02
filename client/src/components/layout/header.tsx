"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/common/button"
import { Menu, Moon, Sun } from "lucide-react"
import { useTheme } from "@/context/themeProvider"
import { useWallet } from "@/context/walletProvider"
import { WalletModal } from "@/components/wallet/WalletModal"
import { WalletInfo } from "@/components/wallet/WalletInfo"

interface HeaderProps {
  onMenuClick: () => void
}

const Header=({ onMenuClick }: HeaderProps)=> {
  const { theme, setTheme } = useTheme()
  const { account } = useWallet()
  const [mounted, setMounted] = useState(false)
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) {
    return null
  }
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">W3</span>
              </div>
              <h1 className="text-xl font-bold text-primary">ToDoer</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {account ? <WalletInfo /> : <Button onClick={() => setIsWalletModalOpen(true)}>Connect Wallet</Button>}
          </div>
        </div>
      </header>

      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
    </>
  )
}

export default Header;
