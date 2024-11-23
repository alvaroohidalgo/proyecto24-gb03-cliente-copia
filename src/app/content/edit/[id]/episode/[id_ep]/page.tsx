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

async function getEpisodio(id_contenido: number, id_episodio: number): Promise<Episodio> {
    const response = await fetch(api_Contenido+"episodios/"+id_episodio);
    if (!response.ok) {
        throw new Error('Failed to fetch episode');
    }
    return response.json();
}

async function updateEpisodio(formData: FormData) {
    'use server'
    
    const episodio: Episodio = {
        id_contenido: Number(formData.get('id_contenido')),
        id_episodio: Number(formData.get('id_episodio')),
        num_temporada: Number(formData.get('num_temporada')),
        num_episodio: Number(formData.get('num_episodio')),
        titulo: formData.get('titulo') as string,
        descripcion: formData.get('descripcion') as string,
        duracion: Number(formData.get('duracion')) ,
        stream_url: formData.get('stream_url') as string,
    };

    let daError = false;

    try {
        const response = await fetch(api_Contenido+"episodios", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(episodio),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el episodio');
        }

        revalidatePath('/');
        //redirect('/admin');
    } catch (error) {
        console.error('Error:', error);
        daError = true;
    }
    if (!daError)
    redirect('/admin');
    else
    redirect('/error'); // Replace '/error' with your error page path

}

interface PageProps {
    params: Promise<{
        id: string;
        id_ep: string;
    }>;
}

export default async function FormularioActualizarEpisodio({ params }: PageProps) {
    const { id, id_ep } = await params;
    const contentId = Number(id);
    const episodeId = Number(id_ep);

    if (!contentId || !episodeId) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-red-600">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>No se proporcionó un ID de contenido o episodio válido.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    let episodio: Episodio;
    try {
        episodio = await getEpisodio(contentId, episodeId);
    } catch (error) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-red-600">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>No se pudo obtener la información del episodio.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-red-600">Actualizar Episodio</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={updateEpisodio} className="space-y-4">
                        <Input
                            type="hidden"
                            name="id_contenido"
                            value={contentId}
                        />
                        <Input
                            type="hidden"
                            name="id_episodio"
                            value={episodeId}
                        />
                        <Input
                            type="number"
                            name="num_temporada"
                            placeholder="Número de Temporada"
                            required
                            defaultValue={episodio.num_temporada}
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                        />
                        <Input
                            type="number"
                            name="num_episodio"
                            placeholder="Número de Episodio"
                            required
                            defaultValue={episodio.num_episodio}
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                        />
                        <Input
                            type="text"
                            name="titulo"
                            placeholder="Título del Episodio"
                            required
                            defaultValue={episodio.titulo}
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                        />
                        <Textarea
                            name="descripcion"
                            placeholder="Descripción del Episodio"
                            required
                            defaultValue={episodio.descripcion}
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                        />
                        <Input
                            type="number"
                            name="duracion"
                            placeholder="Duración (HH:MM:SS)"
                            required
                            defaultValue={episodio.duracion}
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                        />
                        <Input
                            type="url"
                            name="stream_url"
                            placeholder="URL del stream"
                            required
                            defaultValue={episodio.stream_url}
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                        />
                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                            Actualizar Episodio
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}