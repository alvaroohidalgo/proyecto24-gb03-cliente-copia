"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { debounce } from 'lodash'
import axios from 'axios'
import { api_Contenido } from '@/lib/config'
import { contenidoDescType } from '@/lib/types'
import { mockSearch } from '@/app/actions/busqueda'
import Link from 'next/link'
import { redirect } from 'next/navigation'
export interface SearchResult {
    id_contenido: number
    titulo: string
    href: string
    // Add more fields as needed
}

interface RealTimeSearchProps {
    onSearch: (query: string) => Promise<SearchResult[]>
    placeholder?: string
}

export function RealTimeSearch({ onSearch, placeholder = "Search..." }: RealTimeSearchProps) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [isSearching, setIsSearching] = useState(false)

    const debouncedSearch = useCallback(
        debounce(async (searchQuery: string) => {
            if (searchQuery.trim() === '') {
                setResults([])
                return
            }

            setIsSearching(true)
            try {
                const searchResults = await onSearch(searchQuery)
                setResults(searchResults)
            } catch (error) {
                console.error('Search error:', error)
                setResults([])
            } finally {
                setIsSearching(false)
            }
        }, 300),
        [onSearch]
    )

    useEffect(() => {
        debouncedSearch(query)
        return () => debouncedSearch.cancel()
    }, [query, debouncedSearch])

    const handleSearch = () => {
        redirect('/search/'+query)
    }

    return (
        <div className="relative">
            <div className="flex items-center space-x-2">
                <div className="relative flex-grow">
                    <Input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={placeholder}
                        className="pr-10 bg-gray-800 text-gray-200 border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {isSearching && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSearch}
                    className="text-gray-200 hover:text-gray-300 hover:bg-gray-700"
                >
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                </Button>
            </div>
            {results.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                    <ul className="py-1">
                        {results.map((result) => (
                            <li
                                key={result.id_contenido}
                                className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-200 text-sm"
                            >
                                <Link href={'/'+result.href}>
                                {result.titulo}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}



export default function Home() {
    return (

        <RealTimeSearch onSearch={mockSearch} placeholder="Buscar..." />

    )
}

