import { Play } from 'lucide-react'

interface Episodio {
    id_contenido: number;
    id_episodio: number;
    num_temporada: number;
    num_episodio: number;
    titulo: string;
    descripcion: string;
    duracion: string;
    stream_url: string;
}

interface SeriesProps {
    episodios: Episodio[];
}

export default function Series({ episodios }: SeriesProps) {
    const temporadas = Array.from(new Set(episodios.map(e => e.num_temporada))).sort((a, b) => a - b)

    return (
        <div className="bg-[#141414] text-white min-h-screen p-8">
            <h1 className="text-4xl font-bold mb-6">Episodios</h1>
            
            {temporadas.map(temporada => (
                <div key={temporada} className="mb-12">
                    <h2 className="text-3xl font-bold mb-6">Temporada {temporada}</h2>
                    
                    <div className="space-y-4">
                        {episodios
                            .filter(e => e.num_temporada === temporada)
                            .map((episodio) => (
                                <div key={episodio.id_episodio} className="border-b border-gray-600 pb-4">
                                    <div className="flex items-start space-x-4">
                                        <div className="relative w-40 h-24 flex-shrink-0 overflow-hidden">
                                            <div className="absolute inset-0 bg-black" />
                                            <div className="absolute inset-1">
                                                <img
                                                    src={`/placeholder.svg?height=400&width=600&text=E${episodio.num_episodio}`}
                                                    alt={`Episodio ${episodio.num_episodio}`}
                                                    className="rounded bg-black object-cover w-full h-full"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                                                    <Play className="w-12 h-12" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-xl font-semibold">{episodio.num_episodio}. {episodio.titulo}</h3>
                                                <span className="text-gray-400">{episodio.duracion}</span>
                                            </div>
                                            <p className="mt-2 text-gray-400 line-clamp-2">
                                                {episodio.descripcion}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    )
}