import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { api_Contenido } from "@/lib/config"

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
    const res = await fetch(api_Contenido+"generos")
    if (!res.ok) throw new Error('Failed to fetch genres')
    return res.json()
}

async function getActores(): Promise<Actor[]> {
    const res = await fetch(api_Contenido+"actores")
    if (!res.ok) throw new Error('Failed to fetch actors')
    return res.json()
}

async function addContenido(formData: FormData) {
    'use server'
    
    const contenido: IfaceContenidoDesc = {
        id_contenido: 0,
        titulo: formData.get('titulo') as string,
        descripcion: formData.get('descripcion') as string,
        fecha_lanzamiento: formData.get('fecha_lanzamiento') as string,
        duracion: Number(formData.get('duracion')),
        tipo: formData.get('tipo') as string,
        stream_url: formData.get('stream_url') as string,
        portada_url: formData.get('portada_url') as string,
        trailer_url: formData.get('trailer_url') as string,
        id_generos: formData.getAll('generos').map(Number),
        id_actores: formData.getAll('actores').map(Number),
    };

    let daError = false;

    try {
        const response = await fetch(api_Contenido+"contenidos", {
            method: 'POST',
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

export default async function FormularioNetflix() {
    const generos = await getGeneros();
    const actores = await getActores();

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-red-600">Añadir Nuevo Contenido</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={addContenido} className="space-y-4">
                        <Input
                            type="text"
                            name="titulo"
                            placeholder="Título"
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                        />
                        <Textarea
                            name="descripcion"
                            placeholder="Descripción"
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                type="date"
                                name="fecha_lanzamiento"
                                required
                                className="bg-zinc-800 border-zinc-700 text-white"
                            />
                            <Input
                                type="number"
                                name="duracion"
                                placeholder="Duración (en minutos)"
                                required
                                className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                            />
                        </div>
                        <Select name="tipo" required>
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                <SelectValue placeholder="Selecciona el tipo" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                <SelectItem value="pelicula">Película</SelectItem>
                                <SelectItem value="serie">Serie</SelectItem>
                                <SelectItem value="documental">Documental</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            type="url"
                            name="stream_url"
                            placeholder="URL del stream"
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                        />
                        <Input
                            type="url"
                            name="portada_url"
                            placeholder="URL de la portada"
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                        />
                        <Input
                            type="url"
                            name="trailer_url"
                            placeholder="URL del trailer"
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                        />
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-white">Géneros</h3>
                            {generos.map((genero) => (
                                <div key={genero.id_genero} className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={`genero-${genero.id_genero}`} 
                                        name="generos" 
                                        value={genero.id_genero.toString()} 
                                        className="border-white data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                                    />
                                    <label htmlFor={`genero-${genero.id_genero}`} className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {genero.nombre}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-white">Actores</h3>
                            {actores.map((actor) => (
                                <div key={actor.id_actor} className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={`actor-${actor.id_actor}`} 
                                        name="actores" 
                                        value={actor.id_actor.toString()} 
                                        className="border-white data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                                    />
                                    <label htmlFor={`actor-${actor.id_actor}`} className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {`${actor.nombre} ${actor.apellidos}`}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                            Añadir Contenido
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}