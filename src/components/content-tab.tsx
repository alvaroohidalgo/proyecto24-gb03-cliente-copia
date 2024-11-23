import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash } from 'lucide-react'
import AddContentDialog from './add-content-dialog'
import axios from "axios"
import { api_Contenido } from "@/lib/config"
import { redirect } from 'next/navigation'
interface genero {
  id_genero: number;
  nombre: string;
  descripcion: string;
}

interface ContentItem {
  id_contenido: number;
  titulo: string;
  //seasons?: number; // Opcional, ya que las películas no tienen temporadas
  fecha_lanzamiento: number;
  generos: genero[];
  //rating: number;
  tipo: 'serie' | 'pelicula';
}
async function getPeliculas(): Promise<ContentItem[]> {
  const contenido = await getContent();

  const series = contenido.data.filter((item:any) => item.tipo === 'pelicula');

  return series;
}


async function getSeries(): Promise<ContentItem[]> {
  const contenido = await getContent();

  const series = contenido.data.filter((item:ContentItem) => item.tipo === 'serie');

  return series;
}

async function getContent() {
  
  return axios.get(api_Contenido+'contenidos')
    
  
}

async function handleDelete(formData: FormData) {
  'use server'
  const contentId = formData.get('contentId')
  // Aquí iría la lógica para eliminar el género de la base de datos
  axios.delete(api_Contenido + 'contenidos/' + contentId)
  // Redireccionar o recargar la página después de la eliminación
  redirect('/admin')
}

export default async function ContentTab({ contentType = 'movies' }: { contentType?: 'movies' | 'series' }) {

  const series = await getSeries()
  const peliculas = await getPeliculas()



  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestión de Contenido</h2>
      </div>
      <div className="flex justify-end">
        <a href="/content/add">
          <Button
            variant="default"
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center rounded-full p-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Añadir Contenido
          </Button>
        </a>
      </div>
      <h3 className="text-3xl font-bold">Series</h3>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-700">
            <TableHead className="text-gray-300">ID</TableHead>
            <TableHead className="text-gray-300">Título</TableHead>
            <TableHead className="text-gray-300">Año</TableHead>
            
            <TableHead className="text-gray-300">Género</TableHead>
            
            <TableHead className="text-gray-300">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {series.length > 0 && series.map((item) => (
            <TableRow key={item.id_contenido} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
              <TableCell>{item.id_contenido}</TableCell>
              <TableCell className="font-medium">{item.titulo}</TableCell>
              <TableCell>{item.fecha_lanzamiento}</TableCell>
              
              <TableCell>
                {/* Recorremos los géneros */}
                {item.generos.map((gen, index) => (
                  <span key={index}>
                    {gen.nombre}
                    {index < item.generos.length - 1 && ", "}
                  </span>
                ))}
              </TableCell>
              

              <TableCell>
                <div className="flex space-x-2">
                  {/* Usando Link en lugar de <a> para una navegación más eficiente en Next.js */}
                  <a href={`/content/edit/${item.id_contenido}`} >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-gray-700 flex items-center justify-center rounded-full p-2"
                      aria-label={`Editar contenido ${item.id_contenido}`} // Mejora la accesibilidad
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </a>
                  <form action={handleDelete}>
                  <input type="hidden" name="contentId" value={item.id_contenido} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-700 flex items-center justify-center rounded-full p-2"
                    aria-label={`Eliminar contenido ${item.id_contenido}`} // Mejora la accesibilidad
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                  </form>
                  <a href={`/content/${item.id_contenido}/episodes`} >
                  <button
                      className="
                          ml-20 
                          px-4 
                          py-2 
                          rounded 
                          hover:bg-blue-400 
                          transition-colors 
                          duration-200 
                          cursor-pointer
                        "
                    >
                      Ver capitulos
                    </button> 
                    </a>
                </div>
                
              </TableCell>


            </TableRow>
          ))}
        </TableBody>
      </Table>
      <h3 className="text-3xl font-bold">Peliculas</h3>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-700">
            <TableHead className="text-gray-300">ID</TableHead>
            <TableHead className="text-gray-300">Título</TableHead>
            <TableHead className="text-gray-300">Año</TableHead>
            <TableHead className="text-gray-300">Género</TableHead>
            <TableHead className="text-gray-300">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {peliculas.map((item) => (
            <TableRow key={item.id_contenido} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
              <TableCell>{item.id_contenido}</TableCell>
              <TableCell className="font-medium">{item.titulo}</TableCell>
              <TableCell>{item.fecha_lanzamiento}</TableCell>
             
              <TableCell>
                {/* Recorremos los géneros */}
                {item.generos.map((gen, index) => (
                  <span key={index}>
                    {gen.nombre}
                    {index < item.generos.length - 1 && ", "}
                  </span>
                ))}
              </TableCell>

              <TableCell>
                <div className="flex space-x-2">
                  {/* Usando Link en lugar de <a> para una navegación más eficiente en Next.js */}
                  <a href={`/content/edit/${item.id_contenido}`} >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-gray-700 flex items-center justify-center rounded-full p-2"
                      aria-label={`Editar contenido ${item.id_contenido}`} // Mejora la accesibilidad
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </a>
                  <form action={handleDelete}>
                  <input type="hidden" name="contentId" value={item.id_contenido} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-700 flex items-center justify-center rounded-full p-2"
                    aria-label={`Eliminar contenido ${item.id_contenido}`} // Mejora la accesibilidad
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