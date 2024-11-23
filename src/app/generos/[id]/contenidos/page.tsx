import axios from 'axios'
import { api_Contenido } from '@/lib/config'
import Desc_genero from './Desc_genero'

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

export interface IfaceGenero {
    id_genero: number;
    nombre: string;
    descripcion: string;
}

export default async function page({ params }: { params: Promise<{ id: string }> }) {
    const {id} = await params;

    const lista_generos = await axios.get<IfaceGenero[]>(api_Contenido + "generos" ).then((res) => res.data);
    const genero = lista_generos.find((genero) => genero.id_genero === parseInt(id)) || {id_genero: 0, nombre: "", descripcion: ""};

    const contenidos = await axios.get<IfaceContenidosDesc[]>(api_Contenido + "generos/" + id + "/contenidos").then((res) => res.data);

    return (
        <div>
            <Desc_genero genero={genero} contenidos={contenidos} />
        </div>
    )
}