'use client'
import { enviarReproduccion } from '@/app/actions/reproducir'
import { Button } from '@/components/ui/button'
import { api_Personalizacion } from '@/lib/config'
import { contenidoDescType } from '@/lib/types'
import axios from 'axios'
import { PlayCircle } from 'lucide-react'


function BotonReproducir({contenido,id_perfil}:{contenido:any,id_perfil:number}) {
    const handleClick = async () => {
        console.log('Reproducir')
        await enviarReproduccion(id_perfil, contenido.id_contenido)
        window.location.href = contenido.stream_url;
    }
    return (
        <div>
            <button
                onClick={handleClick}
                className="flex items-center px-6 py-2 bg-white text-black font-bold rounded hover:bg-white/90 transition"
            >
                <PlayCircle className="w-5 h-5 mr-2" />
                Reproducir
            </button>
        </div>
    )
}

export default BotonReproducir