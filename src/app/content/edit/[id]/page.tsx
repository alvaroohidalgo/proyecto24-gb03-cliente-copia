import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import { api_Contenido } from "@/lib/config"
import axios from "axios"
import { Label } from "@radix-ui/react-label"

interface Genero {
  id_genero: number;
  nombre: string;
  descripcion: string;
}

interface Actor {
  id_actor: number;
  nombre: string;
  apellidos: string;
  fecha_nac: string;
  imagen_url: string;
  descripcion: string;
}

interface IfaceContenidoDesc {
    id_contenido: number;
    titulo: string;
    descripcion: string;
    fecha_lanzamiento: string;
    duracion: number;
    tipo: string;
    stream_url: string;
    portada_url: string;
    trailer_url: string;
    id_generos: number[];
    id_actores: number[];
}

async function getGeneros(): Promise<Genero[]> {
    const res = await fetch(api_Contenido+'generos')
    if (!res.ok) throw new Error('Failed to fetch genres')
    return res.json()
}

async function getGeneroContenido(id: string) :Promise<Genero[]>{
  const res=await fetch(api_Contenido+'contenidos/'+id+'/generos');
    if (!res.ok) throw new Error('Failed to fetch actors')
    return res.json()
}

async function getActores(): Promise<Actor[]> {
    const res = await fetch(api_Contenido+'actores')
    if (!res.ok) throw new Error('Failed to fetch actors')
    return res.json()
}

async function getActoresContenido(id: string) :Promise<Actor[]>{
  const res=await fetch(api_Contenido+'contenidos/'+id+'/actores');
    if (!res.ok) throw new Error('Failed to fetch actors')
    return res.json()
}

async function getContent(id: string) :Promise<IfaceContenidoDesc>{
  const res=await axios.get(api_Contenido+'contenidos/'+id);
  const dato:IfaceContenidoDesc=res.data;
  console.log(dato);
  return dato;
}

async function addContenido(formData: FormData) {
    'use server'
    
    const contenido: IfaceContenidoDesc = {
        id_contenido: Number(formData.get('id_contenido')),
        titulo: formData.get('titulo') as string,
        descripcion: formData.get('descripcion') as string,
        fecha_lanzamiento: formData.get('fecha_lanzamiento') as string,
        duracion: Number(formData.get('duracion')),
        tipo: formData.get('type') as string,
        stream_url: formData.get('stream_url') as string,
        portada_url: formData.get('portada_url') as string,
        trailer_url: formData.get('trailer_url') as string,
        id_generos: formData.getAll('generos').map(Number),
        id_actores: formData.getAll('actores').map(Number),
    };

    let daError = false;

    try {
        const response = await fetch(api_Contenido+'contenidos', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contenido),
        });

        if (!response.ok) {
            throw new Error('Error al añadir el contenido');
        }

        revalidatePath('/');
        
    } catch (error) {
        console.error('Error:', error);
        daError = true;
    }
    if (!daError)
    redirect('/admin');
    else
    redirect('/error');
}

export default async function FormularioNetflix( 
 props: {
    params: Promise<{ id: string }>
  }
){
    const generos = await getGeneros();
    const actores = await getActores();
   
    const params = await props.params;
    const content = await getContent(params.id)
    const generosContenido = await getGeneroContenido(params.id);
    const actoresContenido = await getActoresContenido(params.id);
    if (!content) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-red-600">Editar Contenido</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={addContenido} className="space-y-4">
                      <Input 
                        type="hidden"
                        name="id_contenido"
                        value={content.id_contenido}
                      />
                      
                    <div>
                    <Label htmlFor="titulo" style={{ color: 'white' }}>Título</Label>
                        <Input
                            type="text"
                            name="titulo"
                            placeholder="Título"
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                            defaultValue={content.titulo}
                        />
                    </div>
                    <div>
                      <Label htmlFor="description" style={{ color: 'white' }}>Descripción</Label>
                        <Textarea
                            name="descripcion"
                            placeholder="Descripción"
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                            defaultValue={content.descripcion}
                        />
                    </div>
                    <div>
                      <Label htmlFor="fecha_lanzamiento" style={{ color: 'white' }}>Fecha de lanzamiento</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                type="string"
                                name="fecha_lanzamiento"
                                required
                                className="bg-zinc-800 border-zinc-700 text-white"
                                defaultValue={content.fecha_lanzamiento}
                            />
                        </div>
                    </div>
                        <div>
                          <Label htmlFor="duracion" style={{ color: 'white' }}>Duracion</Label>
                            <Input
                                type="number"
                                name="duracion"
                                placeholder="Duración (en minutos)"
                                required
                                className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                                defaultValue={content.duracion}
                            />
                        </div>
                        <div>
                        <Label htmlFor="type" style={{ color: 'white' }}>Tipo</Label>
                          <select
                            id="type"
                            name="type"
                            defaultValue={content.tipo}
                            className="bg-zinc-800 border-black-700 rounded-full p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500  text-white"
                          >
                            <option value="pelicula">Película</option>
                            <option value="serie">Serie</option>
                          </select>
                        </div>
                        <div>
                        <Label htmlFor="stream_url" style={{ color: 'white' }}>Stream url</Label>
                        <Input
                            type="url"
                            name="stream_url"
                            placeholder="URL del stream"
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                            defaultValue={content.stream_url}
                        />
                        </div>
                        <div>
                          <Label htmlFor="portada_url" style={{ color: 'white' }}>Portada url</Label>
                        <Input
                            type="url"
                            name="portada_url"
                            placeholder="URL de la portada"
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                            defaultValue={content.portada_url}
                        />
                        </div>
                        <div>
                          <Label htmlFor="trailer_url" style={{ color: 'white' }}>Trailer url</Label>
                        <Input
                            type="url"
                            name="trailer_url"
                            placeholder="URL del trailer"
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                            defaultValue={content.trailer_url}
                        />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-white">Géneros</h3>
                            {generos.map((genero) => (
                                <div key={genero.id_genero} className="flex items-center space-x-2">
                                    <input 
                                        type="checkbox"
                                        id={`genero-${genero.id_genero}`} 
                                        name="generos" 
                                        value={genero.id_genero.toString()} 
                                        defaultChecked={generosContenido.some((g) => g.id_genero === genero.id_genero)}
                                        className="form-checkbox h-5 w-5 text-red-600 transition duration-150 ease-in-out"
                                    />
                                    <label htmlFor={`genero-${genero.id_genero}`} className="text-sm font-medium leading-none text-white">
                                        {genero.nombre}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-white">Actores</h3>
                            {actores.map((actor) => (
                                <div key={actor.id_actor} className="flex items-center space-x-2">
                                    <input 
                                        type="checkbox"
                                        id={`actor-${actor.id_actor}`} 
                                        name="actores" 
                                        value={actor.id_actor.toString()} 
                                        defaultChecked={actoresContenido.some((a) => a.id_actor === actor.id_actor)}
                                        className="form-checkbox h-5 w-5 text-red-600 transition duration-150 ease-in-out"
                                    />
                                    <label htmlFor={`actor-${actor.id_actor}`} className="text-sm font-medium leading-none text-white">
                                        {`${actor.nombre} ${actor.apellidos}`}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                            Editar Contenido
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}