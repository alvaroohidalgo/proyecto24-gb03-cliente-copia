import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { api_Contenido } from "@/lib/config";

interface Actor {
  id_actor: number;
  nombre: string;
  apellidos: string;
  fecha_nac: string;
  imagen_url: string;
  descripcion: string;
}

async function getActor(id_actor: number): Promise<Actor> {
  const response = await fetch(api_Contenido+"actores/"+id_actor);
  if (!response.ok) {
    throw new Error('Failed to fetch actor');
  }
  return response.json();
}

async function updateActor(formData: FormData) {
  'use server'
  
  const actor: Actor = {
    id_actor: Number(formData.get('id_actor')),
    nombre: formData.get('nombre') as string,
    apellidos: formData.get('apellidos') as string,
    fecha_nac: formData.get('fecha_nac') as string,
    imagen_url: formData.get('imagen_url') as string,
    descripcion: formData.get('descripcion') as string,
  };

  let daError = false;

  try {
    const response = await fetch(api_Contenido+'actores', {
      method: 'PUT',
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
  } catch (error) {
    console.error('Error:', error);
    daError = true;
  }
  if (!daError)
    redirect('/admin');
  else
    redirect('/error');
}

interface PageProps {
  params: Promise<{
      id: string;
  }>;
}

export default async function FormularioActualizarActores({ params }: PageProps) {
  const { id } = await params;
  const actorId = Number(id);

  if (!actorId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No se proporcionó un ID de actor válido.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  let actor: Actor;
  try {
    actor = await getActor(actorId);
  } catch (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Error al obtener los datos del actor.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-600">Actualizar Actor</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateActor} className="space-y-4">
            <Input
              type="hidden"
              name="id_actor"
              value={actorId}
            />
            
            {/* Nombre */}
            <div className="space-y-1">
              <label htmlFor="nombre" className="text-sm font-medium text-white">Nombre</label>
              <Input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Nombre"
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                defaultValue={actor.nombre}
              />
            </div>

            {/* Apellidos */}
            <div className="space-y-1">
              <label htmlFor="apellidos" className="text-sm font-medium text-white">Apellidos</label>
              <Input
                type="text"
                id="apellidos"
                name="apellidos"
                placeholder="Apellidos"
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                defaultValue={actor.apellidos}
              />
            </div>

            {/* Fecha de nacimiento */}
            <div className="space-y-1">
              <label htmlFor="fecha_nac" className="text-sm font-medium text-white">Fecha de nacimiento</label>
              <Input
                type="date"
                id="fecha_nac"
                name="fecha_nac"
                required
                className="bg-zinc-800 border-zinc-700 text-white"
                defaultValue={actor.fecha_nac}
              />
            </div>

            {/* Imagen URL */}
            <div className="space-y-1">
              <label htmlFor="imagen_url" className="text-sm font-medium text-white">URL de la imagen</label>
              <Input
                type="url"
                id="imagen_url"
                name="imagen_url"
                placeholder="URL de la imagen"
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                defaultValue={actor.imagen_url}
              />
            </div>

            {/* Descripción */}
            <div className="space-y-1">
              <label htmlFor="descripcion" className="text-sm font-medium text-white">Descripción</label>
              <Textarea
                id="descripcion"
                name="descripcion"
                placeholder="Descripción"
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                defaultValue={actor.descripcion}
              />
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
              Actualizar Actor
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
  