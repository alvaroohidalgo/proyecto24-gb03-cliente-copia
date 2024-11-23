import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { api_Contenido } from "@/lib/config"
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'


interface Genero {
  nombre: string;
  descripcion: string;
}

async function addGenre(formData: FormData) {
  'use server'
  
  // Simular la adición del género a la base de datos
  const genero: Genero = {
    
    nombre: formData.get('name') as string,
    descripcion: formData.get('description') as string
  }
  let daError = false;
  try {
    const response = await fetch(api_Contenido+'generos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(genero),
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
  // En una aplicación real, aquí se añadiría la lógica para guardar en la base de datos
}



export default function AddGenrePage() {
  return (
    <div className="min-h-screen bg-[#141414] text-white">
      
      <main className="container mx-auto px-4 py-8 ">
        <h1 className="text-3xl font-bold mb-6 mt-20">Añadir Nuevo Género</h1>
        <form action={addGenre} className="max-w-md">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Nombre del Género
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              required
              className="w-full bg-[#333] border-none text-white"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Descripción
            </label>
            <Textarea
              id="description"
              name="description"
              required
              className="w-full bg-[#333] border-none text-white"
              rows={4}
            />
          </div>
          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
            Añadir Género
          </Button>
        </form>
      </main>
    </div>
  )
}