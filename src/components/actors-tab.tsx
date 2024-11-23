import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Trash, Search, Plus } from 'lucide-react'
import axios from "axios"
import { api_Contenido } from "@/lib/config"
import { redirect } from 'next/navigation'

interface Actor {
  id_actor: number
  nombre: string
  apellidos: string
  fecha_nacimiento: string
  descripcion: string
}
async function getActors() {
  // This would be a server-side fetch in a real application
  
    // Fetching the users data from the API using axios
    const response = await axios.get(api_Contenido + 'actores');
    return response.data; // We return the data directly, which should be an array of users
  
}

async function handleDelete(formData: FormData) {
  'use server'
  const actorId = formData.get('actorId')
  // Aquí iría la lógica para eliminar el género de la base de datos
  axios.delete(api_Contenido + 'actores/' + actorId)
  // Redireccionar o recargar la página después de la eliminación
  redirect('/admin')
}

export default async function ActorsTab() {
  const actors = await getActors()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestión de Actores</h2>
        <div className="flex items-center space-x-4">
          <Input
            type="search"
            placeholder="Buscar actores..."
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <Search className="mr-2 h-4 w-4" /> Buscar
          </Button>
          <a href="/actor/add">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Añadir Actor
          </Button>
          </a>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-700">
            <TableHead className="text-gray-300">ID</TableHead>
            <TableHead className="text-gray-300">Nombre</TableHead>
            <TableHead className="text-gray-300">Apellidos</TableHead>
            <TableHead className="text-gray-300">Fecha de nacimiento</TableHead>
            <TableHead className="text-gray-300">Descripcion</TableHead>
            <TableHead className="text-gray-300">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {actors.map((actor: Actor) => (
            <TableRow key={actor.id_actor} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
              <TableCell>{actor.id_actor}</TableCell>
              <TableCell className="font-medium">{actor.nombre}</TableCell>
              <TableCell className="font-medium">{actor.apellidos}</TableCell>
              <TableCell>{actor.fecha_nacimiento}</TableCell>
              <TableCell>{actor.descripcion}</TableCell>
              
              <TableCell>
                <div className="flex space-x-2">
                  <a href={`/actor/edit/${actor.id_actor}`} className="hover:bg-gray-700 p-1 rounded-md">
                  <Button variant="ghost" size="icon" className="hover:bg-gray-700">
                    <Edit className="h-4 w-4 text-blue-400" />
                  </Button>
                  </a>
                  <form action={handleDelete}>
                  <input type="hidden" name="actorId" value={actor.id_actor} />
                  <Button variant="ghost" size="icon" className="hover:bg-gray-700">
                    <Trash className="h-4 w-4 text-red-400" />
                  </Button>
                  </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}