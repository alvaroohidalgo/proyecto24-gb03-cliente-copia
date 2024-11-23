import axios from 'axios'
import { api_Contenido } from '@/lib/config'
import Desc_actores from './Desc_actores'

export interface IfaceContenidosDesc {
    id_contenido: number;
    titulo: string;
    descripcion: string;
    fecha_lanzamiento: string;
    duracion: number;
    tipo: string;
    stream_url: string;
    portada_url: string;
    trailer_url: string;
}

interface IfaceActor {
    id: number;
    nombre: string;
    apellidos: string;
    fecha_nac: string;
    imagen_url: string;
    descripcion: string;
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    const [actor, contenidos] = await Promise.all([
        axios.get<IfaceActor>(api_Contenido+"actores/"+id).then((res) => res.data),
        axios.get<IfaceContenidosDesc[]>(api_Contenido+"actores/"+id+"/contenidos").then((res) => res.data)
    ])

    return (
        <div>
            <Desc_actores actor={actor} contenidos={contenidos} />
        </div>
    )
}