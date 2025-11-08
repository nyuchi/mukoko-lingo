"use client"

import type React from "react"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, BookOpen, Globe, Send, Loader2 } from "lucide-react"
import { translations, type UILanguage } from "@/lib/translations"
import { ScenarioGenerator } from "./scenario-generator"
import { TranslationHelper } from "./translation-helper"

export function AIPracticeClient() {
  const [uiLanguage, setUiLanguage] = useState<UILanguage>("en")
  const [practiceLanguage, setPracticeLanguage] = useState("english")
  const [conversationType, setConversationType] = useState<"practice" | "scenario" | "translation_help">("practice")
  const [conversationId, setConversationId] = useState<string>()
  const [scenario, setScenario] = useState<any>(null)

  const { messages, sendMessage, status, input, setInput } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
      body: {
        conversationId,
        type: conversationType,
        language: practiceLanguage,
      },
    }),
  })

  const t = translations[uiLanguage]

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      sendMessage({ text: input })
      setInput("")
    }
  }

  const startNewConversation = () => {
    setConversationId(undefined)
    setScenario(null)
  }

  const handleStartScenario = (newScenario: any) => {
    setScenario(newScenario)
    // Send the starter message automatically
    sendMessage({ text: newScenario.starterMessage })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="mb-4">
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
            {t.aiPractice || "AI Conversation Practice"}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t.aiPracticeSubtitle || "Practice real conversations with AI tutors in your target language"}
          </p>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-4">
          <Card className="p-4 h-fit space-y-4">
            <h3 className="font-serif font-semibold">{t.settings || "Settings"}</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">{t.practiceLanguage || "Practice Language"}</label>
                <select
                  value={practiceLanguage}
                  onChange={(e) => setPracticeLanguage(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background text-sm"
                >
                  <option value="english">English</option>
                  <option value="shona">Shona</option>
                  <option value="ndebele">Ndebele</option>
                  <option value="chinese">Chinese</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t.conversationType || "Conversation Type"}</label>
                <Tabs value={conversationType} onValueChange={(v) => setConversationType(v as any)}>
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="practice" className="text-xs">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      {t.practice || "Practice"}
                    </TabsTrigger>
                    <TabsTrigger value="scenario" className="text-xs">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {t.scenario || "Scenario"}
                    </TabsTrigger>
                    <TabsTrigger value="translation_help" className="text-xs">
                      <Globe className="h-3 w-3 mr-1" />
                      {t.help || "Help"}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <Button onClick={startNewConversation} variant="outline" size="sm" className="w-full bg-transparent">
                {t.newConversation || "New Conversation"}
              </Button>
            </div>

            {conversationType === "scenario" && !scenario && (
              <ScenarioGenerator language={practiceLanguage} onStartScenario={handleStartScenario} />
            )}

            {conversationType === "translation_help" && <TranslationHelper />}
          </Card>

          <Card className="flex flex-col h-[calc(100vh-16rem)]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mb-3 opacity-50" />
                  <p className="text-lg font-medium mb-1">{t.startChatting || "Start chatting with your AI tutor"}</p>
                  <p className="text-sm">
                    {t.chatHint || "Ask questions, practice phrases, or simulate real conversations"}
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.parts.map((part, index) => {
                        if (part.type === "text") {
                          return (
                            <p key={index} className="text-sm whitespace-pre-wrap">
                              {part.text}
                            </p>
                          )
                        }
                        return null
                      })}
                    </div>
                  </div>
                ))
              )}

              {status === "in_progress" && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.typeMessage || "Type your message..."}
                  disabled={status === "in_progress"}
                  className="flex-1"
                />
                <Button type="submit" disabled={!input.trim() || status === "in_progress"} size="icon">
                  {status === "in_progress" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
