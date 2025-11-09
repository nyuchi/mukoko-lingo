"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Plus, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Phrase {
  id: string
  category: string
  english: string
  shona: string
  ndebele: string
  chinese: string
  created_at: string
}

interface PhraseManagementProps {
  phrases: Phrase[]
}

export function PhraseManagement({ phrases }: PhraseManagementProps) {
  const [phraseSearchTerm, setPhraseSearchTerm] = useState("")
  const [phraseSortField, setPhraseSortField] = useState<keyof Phrase>("category")
  const [phraseSortDirection, setPhraseSortDirection] = useState<"asc" | "desc">("asc")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const filteredPhrases = useMemo(() => {
    const filtered = phrases.filter((phrase) => {
      const matchesSearch =
        phrase.english?.toLowerCase().includes(phraseSearchTerm.toLowerCase()) ||
        phrase.shona?.toLowerCase().includes(phraseSearchTerm.toLowerCase()) ||
        phrase.ndebele?.toLowerCase().includes(phraseSearchTerm.toLowerCase()) ||
        phrase.chinese?.toLowerCase().includes(phraseSearchTerm.toLowerCase())

      const matchesCategory = categoryFilter === "all" || phrase.category === categoryFilter

      return matchesSearch && matchesCategory
    })

    return filtered.sort((a, b) => {
      const aVal = a[phraseSortField]
      const bVal = b[phraseSortField]
      const modifier = phraseSortDirection === "asc" ? 1 : -1

      if (typeof aVal === "string" && typeof bVal === "string") {
        return aVal.localeCompare(bVal) * modifier
      }
      return ((aVal as number) - (bVal as number)) * modifier
    })
  }, [phrases, phraseSearchTerm, phraseSortField, phraseSortDirection, categoryFilter])

  const togglePhraseSort = (field: keyof Phrase) => {
    if (phraseSortField === field) {
      setPhraseSortDirection(phraseSortDirection === "asc" ? "desc" : "asc")
    } else {
      setPhraseSortField(field)
      setPhraseSortDirection("asc")
    }
  }

  const SortIcon = ({
    field,
    currentField,
    direction,
  }: { field: string; currentField: string; direction: "asc" | "desc" }) => {
    if (field !== currentField) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
    return direction === "asc" ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-4 flex-1">
          <div>
            <CardTitle className="font-serif">Phrase Management</CardTitle>
            <CardDescription>Add, edit, or delete phrases in the database</CardDescription>
          </div>
          <div className="flex gap-4 items-center flex-wrap">
            <Input
              placeholder="Search phrases in any language..."
              value={phraseSearchTerm}
              onChange={(e) => setPhraseSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="greetings">Greetings</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="school">School</SelectItem>
                <SelectItem value="money">Money</SelectItem>
                <SelectItem value="weather">Weather</SelectItem>
                <SelectItem value="emotions">Emotions</SelectItem>
                <SelectItem value="work">Work</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              Showing {filteredPhrases.length} of {phrases.length} phrases
            </div>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Phrase
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Phrase</DialogTitle>
              <DialogDescription>Add a new phrase to the Nyuchi Lingo database</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="greetings">Greetings</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="money">Money</SelectItem>
                    <SelectItem value="weather">Weather</SelectItem>
                    <SelectItem value="emotions">Emotions</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                Note: Full phrase creation form would include fields for all four languages with pronunciations and
                contexts.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePhraseSort("category")}
                      className="hover:bg-transparent"
                    >
                      Category
                      <SortIcon field="category" currentField={phraseSortField} direction={phraseSortDirection} />
                    </Button>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePhraseSort("english")}
                      className="hover:bg-transparent"
                    >
                      English
                      <SortIcon field="english" currentField={phraseSortField} direction={phraseSortDirection} />
                    </Button>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePhraseSort("shona")}
                      className="hover:bg-transparent"
                    >
                      Shona
                      <SortIcon field="shona" currentField={phraseSortField} direction={phraseSortDirection} />
                    </Button>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePhraseSort("ndebele")}
                      className="hover:bg-transparent"
                    >
                      Ndebele
                      <SortIcon field="ndebele" currentField={phraseSortField} direction={phraseSortDirection} />
                    </Button>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePhraseSort("chinese")}
                      className="hover:bg-transparent"
                    >
                      Chinese
                      <SortIcon field="chinese" currentField={phraseSortField} direction={phraseSortDirection} />
                    </Button>
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPhrases.slice(0, 50).map((phrase) => (
                  <tr key={phrase.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">
                      <Badge variant="outline">{phrase.category}</Badge>
                    </td>
                    <td className="p-4 align-middle font-medium">{phrase.english}</td>
                    <td className="p-4 align-middle">{phrase.shona}</td>
                    <td className="p-4 align-middle">{phrase.ndebele}</td>
                    <td className="p-4 align-middle">{phrase.chinese}</td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
