"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { translations, type UILanguage } from "@/lib/translations"
import { Loader2 } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  uiLanguage: UILanguage
}

export function AuthModal({ isOpen, onClose, uiLanguage }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const supabase = createClient()

  const t = translations[uiLanguage]

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      onClose()
      setEmail("")
      setPassword("")
    }

    setIsLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      onClose()
      setEmail("")
      setPassword("")
    }

    setIsLoading(false)
  }

  const authContent = {
    en: {
      title: "Sign in to continue",
      description: "Create an account or sign in to bookmark phrases and track your progress",
      signIn: "Sign In",
      signUp: "Sign Up",
      email: "Email",
      password: "Password",
      signInButton: "Sign in",
      signUpButton: "Create account",
      or: "or",
      alreadyHaveAccount: "Already have an account?",
      noAccount: "Don't have an account?",
    },
    sn: {
      title: "Pinda kuti uenderere mberi",
      description: "Gadzira account kana pinda kuti uchengete mashoko uye utevere kufambira mberi kwako",
      signIn: "Pinda",
      signUp: "Nyoresa",
      email: "Email",
      password: "Password",
      signInButton: "Pinda",
      signUpButton: "Gadzira account",
      or: "kana",
      alreadyHaveAccount: "Une account?",
      noAccount: "Hauna account?",
    },
    nd: {
      title: "Ngena ukuze uqhubeke",
      description: "Yakha i-akhawunti noma ungene ukuze umake amazwi ulandelele ukuqhubeka kwakho",
      signIn: "Ngena",
      signUp: "Bhalisela",
      email: "I-imeyili",
      password: "Iphasiwedi",
      signInButton: "Ngena",
      signUpButton: "Yakha i-akhawunti",
      or: "noma",
      alreadyHaveAccount: "Usulenhlangano?",
      noAccount: "Awunayo i-akhawunti?",
    },
    zh: {
      title: "登录以继续",
      description: "创建账户或登录以收藏短语并跟踪您的进度",
      signIn: "登录",
      signUp: "注册",
      email: "电子邮件",
      password: "密码",
      signInButton: "登录",
      signUpButton: "创建账户",
      or: "或",
      alreadyHaveAccount: "已有账户？",
      noAccount: "没有账户？",
    },
  }

  const content = authContent[uiLanguage]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">{content.title}</DialogTitle>
          <DialogDescription>{content.description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">{content.signIn}</TabsTrigger>
            <TabsTrigger value="signup">{content.signUp}</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">{content.email}</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">{content.password}</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {content.signInButton}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">{content.email}</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">{content.password}</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {content.signUpButton}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
