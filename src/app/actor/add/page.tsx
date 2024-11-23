import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { api_Contenido } from "@/lib/config"

interface Actor {
  id_actor: number;
  nombre: string;
  apellidos: string;
  fecha_nac: string;
  imagen_url: string;
  descripcion: string;
}

async function addActor(formData: FormData) {
    'use server'
    
    const actor: Actor = {
        id_actor: 0, // Assuming the server will generate the ID
        nombre: formData.get('nombre') as string,
        apellidos: formData.get('apellidos') as string,
        fecha_nac: formData.get('fecha_nac') as string,
        imagen_url: formData.get('imagen_url') as string,
        descripcion: formData.get('descripcion') as string,
    };

    let daError = false;

    try {
        const response = await fetch(api_Contenido+'actores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(actor),
        });

        if (!response.ok) {
            throw new Error('Error al añadir el actor');
        }

        // Revalidate the current path to show updated data
        revalidatePath('/');
        // Replace '/actores' with your desired redirect path
        
    } catch (error) {
        console.error('Error:', error);
        // You might want to handle this error in a way that's appropriate for your application
        
        daError = true;
    }
    if (!daError)
    redirect('/admin');
    else
    redirect('/error'); // Replace '/error' with your error page path
}

export default function FormularioActores() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-red-600">Añadir Nuevo Actor</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={addActor} className="space-y-4">
                        <Input
                            type="text"
                            name="nombre"
                            placeholder="Nombre"
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                        />
                        <Input
                            type="text"
                            name="apellidos"
                            placeholder="Apellidos"
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                        />
                        <Input
                            type="date"
                            name="fecha_nac"
                            required
                            className="bg-zinc-800 border-zinc-700 text-white"
                        />
                        <Input
                            type="url"
                            name="imagen_url"
                            placeholder="URL de la imagen"
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                        />
                        <Textarea
                            name="descripcion"
                            placeholder="Descripción"
                            required
                            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                        />
                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                            Añadir Actor
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}