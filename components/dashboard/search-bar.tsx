"use client"

import { useCallback, useState } from "react"
import { debounce } from "lodash"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"

type SearchInputProps = {
  className?: string
  onSearch: (value: string) => void
  placeholder?: string
  title?: string
}

export function SearchInput({
  className,
  onSearch,
  placeholder = "Search...",
  title = "Search",
}: SearchInputProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearch(value)
    }, 500),
    []
  )

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    debouncedSearch(e.target.value)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleChange}
          className="w-full"
        />
      </CardContent>
    </Card>
  )
}
