import { api_Contenido } from '@/lib/config'
import { Pencil, Trash2, PlusCircle } from 'lucide-react'
import Link from 'next/link'

interface Episodio {
  id_contenido: number
  id_episodio: number
  num_temporada: number
  num_episodio: number
  titulo: string
  descripcion: string
  duracion: string
  stream_url: string
}

async function getEpisodios(id: string): Promise<Episodio[]> {
  const res = await fetch(api_Contenido+"contenidos/"+id+"/episodios")
  if (!res.ok) {
    throw new Error('Failed to fetch episodes')
  }
  return res.json()
}

export default async function EpisodesPage({ params }: { params: { id: string } }) {
  const episodios = await getEpisodios(params.id)

  return (
    <div className="min-h-screen bg-black text-white p-8 ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mt-16">Episodios del Contenido {params.id}</h1>
        <Link
          href={`/content/add/${params.id}/episode`}
          className="bg-green-500 hover:bg-green-600 text-white mt-8 font-bold py-2 px-4 rounded inline-flex items-center transition-colors"
        >
          <PlusCircle className="mr-2" />
          Añadir Episodio
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-red-600 text-left">
              <th className="p-3">Temporada</th>
              <th className="p-3">Episodio</th>
              <th className="p-3">Título</th>
              <th className="p-3">Descripción</th>
              <th className="p-3">Duración</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {episodios.map((episodio) => (
              <tr key={episodio.id_episodio} className="border-b border-gray-700 hover:bg-gray-900">
                <td className="p-3">{episodio.num_temporada}</td>
                <td className="p-3">{episodio.num_episodio}</td>
                <td className="p-3">{episodio.titulo}</td>
                <td className="p-3">{episodio.descripcion}</td>
                <td className="p-3">{episodio.duracion}</td>
                <td className="p-3">
                  <div className="flex space-x-2">
                    <Link
                      href={`/content/edit/${params.id}/episode/${episodio.id_episodio}`}
                      className="p-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/content/${params.id}/episodes/${episodio.id_episodio}/delete`}
                      className="p-2 bg-red-500 rounded hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}