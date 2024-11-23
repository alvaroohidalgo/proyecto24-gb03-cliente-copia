import { IfaceContenidosDesc, IfaceGenero } from './page'
import Link from 'next/link'
import { Play, Info } from 'lucide-react'

interface Desc_generoProps {
    genero: IfaceGenero;
    contenidos: IfaceContenidosDesc[];
}

export default function Desc_genero({ genero, contenidos }: Desc_generoProps) {
    return (
        <div className="min-h-screen bg-black text-white p-8">
            
  
            {/* Content Title */}
            <h2 className="text-3xl font-semibold text-center mb-8 mt-10">Contenido relacionado con {genero.nombre}</h2>

            {/* Content Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {contenidos.map((contenido) => (
                    <Link href={`/contenido/${contenido.id_contenido}`} key={contenido.id_contenido}>
                        <div className="relative group cursor-pointer">
                            <img
                                src={contenido.portada_url}
                                alt={contenido.titulo}
                                width={300}
                                height={450}
                                className="rounded-md transition-transform duration-200 group-hover:scale-105 h-[150px] object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-200 flex items-end justify-center">
                                <div className="text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <h3 className="text-lg font-semibold">{contenido.titulo}</h3>
                                    <p className="text-sm">{new Date(contenido.fecha_lanzamiento).getFullYear()}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}