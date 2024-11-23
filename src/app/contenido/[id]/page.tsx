import Desc_contenido from "./Desc_contenido"
import Series from "./Series"
import axios from 'axios'
import { api_Contenido } from '@/lib/config'

export interface IfaceContenidoDesc {
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

export interface Episodio {
    id_contenido: number;
    id_episodio: number;
    num_temporada: number;
    num_episodio: number;
    titulo: string;
    descripcion: string;
    duracion: string;
    stream_url: string;
}

async function page({ params }: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    const contenido = await axios.get(api_Contenido + "contenidos/" + id).then((res) => res.data)
    let episodios: Episodio[] = []
    
    if (contenido.tipo === "serie") {
        episodios = await axios.get(api_Contenido + `contenidos/${id}/episodios`).then((res) => res.data)
    }

    return (
        <div>
            <Desc_contenido contenido={contenido} />
            {contenido.tipo === "serie" && <Series episodios={episodios} />}
        </div>
    )
}

export default page