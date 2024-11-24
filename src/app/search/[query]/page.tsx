
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"
import axios from 'axios';
import { api_Contenido } from '@/lib/config';

export type contenidoDescType = {
  id_contenido: number;
  titulo: string;
  descripcion: string;
  fecha_lanzamiento: string;
  duracion: number;
  tipo: string;
  stream_url: string;
  portada_url: string;
  trailer_url: string;
  generos: generoType[];
}

type generoType = {
  id_genero: number;
  nombre: string;
}

async function searchContent(query: string): Promise<contenidoDescType[]> {
  // This is where you'd typically fetch data from your API
  // For demonstration, we'll return mock data
  try {
    if (query == '*')
      query = '';
    const response = await axios.get(api_Contenido + 'contenidos/filtrar?titulo=' + query)
    const contenidos: contenidoDescType[] = response.data
    return contenidos
  } catch (error) {
    console.error('Error fetching content:', error)
    return []
  }


}

export default async function SearchResults({ params }: { params: { query: string } }) {
  const {query} = await params
  const results = await searchContent(query)



  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-20 py-8 pt-20">
        <h1 className="text-4xl font-bold mb-8">Resultados de búsqueda</h1>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {results.length > 0 && results.map((item) => (
            <Link href={"/contenido/"+item.id_contenido} key={item.id_contenido} className="group">
              <div className="relative aspect-[3/3]  overflow-hidden rounded-lg">
                <img
                  src={item.portada_url}
                  alt={item.titulo}
                  className="object-cover transition-transform duration-300 group-hover:scale-110 w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-lg font-semibold mb-1">{item.titulo}</h3>
                  <p className="text-sm text-gray-300 mb-2">{item.fecha_lanzamiento.split('-')[0]} • {item.duracion}m</p>
                  <div className="flex flex-wrap gap-2">
                    {item.generos.map((genero) => (
                      <Badge key={genero.id_genero} variant="secondary" className="bg-red-600 text-white">
                        {genero.nombre}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

