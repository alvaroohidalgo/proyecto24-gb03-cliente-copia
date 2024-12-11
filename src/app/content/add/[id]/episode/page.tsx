import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { api_Contenido } from "@/lib/config"

interface Episodio {
    id_contenido: number;
    id_episodio: number;
    num_temporada: number;
    num_episodio: number;
    titulo: string;
    descripcion: string;
    duracion: number;
    stream_url: string;
}

async function addEpisodio(formData: FormData) {
    'use server'
    
    const episodio: Episodio = {
        id_contenido: Number(formData.get('id_contenido')),
        id_episodio: 0, // This will be assigned by the server
        num_temporada: Number(formData.get('num_temporada')),
        num_episodio: Number(formData.get('num_episodio')),
        titulo: formData.get('titulo') as string,
        descripcion: formData.get('descripcion') as string,
        duracion: Number(formData.get('duracion')),
        stream_url: formData.get('stream_url') as string,
    };
    let daError = false;
    try {
        const response = await fetch(api_Contenido+"episodios", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(episodio),
        });

     
        if (!response.ok) {
            throw new Error('Error al añadir el episodio');
        }

        revalidatePath('/');
    } catch (error) {
        console.error('Error:', error);
        daError = true;
    }
    if (!daError)
    redirect('/admin');
    else
    redirect('/error'); // Replace '/error' with your error page path
}

export default function FormularioEpisodio({ params }: { params?: { id?: string } }) {
    const contentId = params?.id ?? '';

    if (!contentId) {
        // Handle the case where no ID is provided
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-red-600">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>No se proporcionó un ID de contenido válido.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-red-600">Añadir Nuevo Episodio</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={addEpisodio} className="space-y-4">
                        <Input
                            type="hidden"
                            name="id_contenido"
                            value={contentId}
                        />
                        <Input
                            type="number"
                            name="num_temporada"
                            placeholder="Número de Temporada"
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                        />
                        <Input
                            type="number"
                            name="num_episodio"
                            placeholder="Número de Episodio"
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                        />
                        <Input
                            type="text"
                            name="titulo"
                            placeholder="Título del Episodio"
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                        />
                        <Textarea
                            name="descripcion"
                            placeholder="Descripción del Episodio"
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                        />
                        <Input
                            type="number"
                            name="duracion"
                            placeholder="Duración "
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                        />
                        <Input
                            type="url"
                            name="stream_url"
                            placeholder="URL del stream"
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                        />
                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                            Añadir Episodio
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}