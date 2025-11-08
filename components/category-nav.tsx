"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  Users,
  ShoppingBag,
  Utensils,
  Briefcase,
  HeartPulse,
  Car,
  GraduationCap,
  DollarSign,
  Cloud,
  Smile,
} from "lucide-react"
import { translations, type UILanguage } from "@/lib/translations"

interface CategoryNavProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
  uiLanguage: UILanguage
}

const categoryIcons: Record<string, React.ReactNode> = {
  greetings: <MessageSquare className="w-4 h-4" />,
  family: <Users className="w-4 h-4" />,
  shopping: <ShoppingBag className="w-4 h-4" />,
  food: <Utensils className="w-4 h-4" />,
  health: <HeartPulse className="w-4 h-4" />,
  transport: <Car className="w-4 h-4" />,
  school: <GraduationCap className="w-4 h-4" />,
  money: <DollarSign className="w-4 h-4" />,
  weather: <Cloud className="w-4 h-4" />,
  emotions: <Smile className="w-4 h-4" />,
  work: <Briefcase className="w-4 h-4" />,
}
// </CHANGE>

export function CategoryNav({ activeCategory, onCategoryChange, uiLanguage }: CategoryNavProps) {
  const t = translations[uiLanguage]

  const categories = [
    { id: "greetings", label: t.categories.greetings },
    { id: "family", label: t.categories.family },
    { id: "shopping", label: t.categories.shopping },
    { id: "food", label: t.categories.food },
    { id: "health", label: t.categories.health },
    { id: "transport", label: t.categories.transport },
    { id: "school", label: t.categories.school },
    { id: "money", label: t.categories.money },
    { id: "weather", label: t.categories.weather },
    { id: "emotions", label: t.categories.emotions },
    { id: "work", label: t.categories.work },
  ]
  // </CHANGE>

  return (
    <div className="border-y bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ScrollArea className="w-full">
        <div className="container mx-auto px-4 py-2.5">
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(category.id)}
                className="whitespace-nowrap gap-2"
              >
                {categoryIcons[category.id]}
                {category.label}
              </Button>
            ))}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
