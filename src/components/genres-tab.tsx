import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { api_Contenido } from "@/lib/config"
import { Plus, Edit, Trash } from 'lucide-react'
import axios from "axios"
import { redirect } from 'next/navigation'



// This would typically come from a database
interface Genre {
  id: number;
  name: string;
  description: string;
}

async function getContent(): Promise<Genre[]> {
  try {
    const data = await axios.get(api_Contenido + 'generos');
    // Mapea los datos a la interfaz `Genre`
    return data.data.map((item: any) => ({
      id: item.id_genero,
      name: item.nombre,
      description: item.descripcion,
    }));
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw new Error("No se pudieron obtener los géneros.");
  }
}

async function handleDelete(formData: FormData) {
  'use server'
  const genreId = formData.get('genreId')
  // Aquí iría la lógica para eliminar el género de la base de datos
  axios.delete(api_Contenido + 'generos/' + genreId)
  // Redireccionar o recargar la página después de la eliminación
  redirect('/admin')
}
export default async function GenresList() {
  const genres= await getContent()
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestión de Géneros</h2>
      </div>
      <div className="flex justify-end">
        <a href="/genres/add">
          <Button
            variant="default"
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center rounded-full p-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Añadir Género
          </Button>
        </a>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-700">
            <TableHead className="text-gray-300">ID</TableHead>
            <TableHead className="text-gray-300">Nombre</TableHead>
            <TableHead className="text-gray-300">Descripción</TableHead>
            <TableHead className="text-gray-300">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {genres.map((genre) => (
            <TableRow key={genre.id} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
              <TableCell>{genre.id}</TableCell>
              <TableCell className="font-medium">{genre.name}</TableCell>
              <TableCell>{genre.description}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                <a href={`/genres/edit/${genre.id}`} >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-700 flex items-center justify-center rounded-full p-2"
                  aria-label={`Editar género ${genre.id}`}
                  
                >
                  <Edit className="h-4 w-4" />
                </Button>
                </a>
                  <form action={handleDelete}>
                  <input type="hidden" name="genreId" value={genre.id} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-700 flex items-center justify-center rounded-full p-2"
                    aria-label={`Eliminar género ${genre.id}`}
                  >
                    <Trash className="h-4 w-4" />
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