'use client'
import Link from 'next/link'


import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function AddContentDialog() {
  const [contentType, setContentType] = useState<'movie' | 'series'>('movie')

  return (
    <Dialog>
      
      <Link href="/content/add">
  <Button className="bg-red-600 hover:bg-red-700 text-white flex items-center">
    <Plus className="mr-2 h-4 w-4" /> Añadir Contenido
  </Button>
</Link>
    
    
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Contenido</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <div>
            <Label htmlFor="contentType">Tipo de Contenido</Label>
            <Select onValueChange={(value) => setContentType(value as 'movie' | 'series')}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Seleccionar tipo de contenido" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="movie">Película</SelectItem>
                <SelectItem value="series">Serie</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="title">Título</Label>
            <Input id="title" placeholder="Título del contenido" className="bg-gray-700 border-gray-600 text-white" />
          </div>
          {contentType === 'movie' ? (
            <div>
              <Label htmlFor="year">Año</Label>
              <Input id="year" type="number" placeholder="Año de lanzamiento" className="bg-gray-700 border-gray-600 text-white" />
            </div>
          ) : (
            <div>
              <Label htmlFor="seasons">Temporadas</Label>
              <Input id="seasons" type="number" placeholder="Número de temporadas" className="bg-gray-700 border-gray-600 text-white" />
            </div>
          )}
          <div>
            <Label htmlFor="genre">Género</Label>
            <Input id="genre" placeholder="Género del contenido" className="bg-gray-700 border-gray-600 text-white" />
          </div>
          <div>
            <Label htmlFor="rating">Calificación</Label>
            <Input id="rating" type="number" step="0.1" min="0" max="10" placeholder="Calificación (0-10)" className="bg-gray-700 border-gray-600 text-white" />
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" placeholder="Breve descripción del contenido" className="bg-gray-700 border-gray-600 text-white" />
          </div>
          <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white w-full">Guardar Contenido</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}