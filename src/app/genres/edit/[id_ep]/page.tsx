import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { api_Contenido } from "@/lib/config"
import axios from "axios"
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

interface GeneroFetch {
  id_genero: number;
  nombre: string;
  descripcion: string;
}
interface Genero {
 
    nombre: string;
    descripcion: string;
  }

async function getGenres(): Promise<GeneroFetch[]> {
  try {
    const response = await axios.get(`${api_Contenido}generos`);
    
    if (response.status !== 200) {
      throw new Error('Error al obtener los géneros');
    }

    const generos: GeneroFetch[] = response.data.map((item: any) => ({
      id_genero: item.id_genero,
      nombre: item.nombre,
      descripcion: item.descripcion,
    }));

    return generos;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error al obtener los géneros: ${error.message}`);
    } else {
      throw new Error('Error desconocido al obtener los géneros');
    }
  }
}

async function getGeneroById(id: number): Promise<GeneroFetch> {
  const generos = await getGenres();
  const genero = generos.find((genero) => genero.id_genero === id);
  if (!genero) {
    throw new Error('Género no encontrado');
  }
  return genero;
}

async function updateGenre(formData: FormData) {
    'use server'
    
    const genero: GeneroFetch = {
        id_genero: parseInt(formData.get('id_genero') as string),
        nombre: formData.get('name') as string,
        descripcion: formData.get('description') as string
    }
    console.log(genero);
    let daError = false;
    try {
        const response = await fetch(api_Contenido+'generos', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(genero),
        });
    
        if (!response.ok) {
            throw new Error('Error al actualizar el género\n');
          
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
export default async function UpdateGenrePage({ params }: { params: { id_ep: string } }) {
  const { id_ep } = await params;
  const genero = await getGeneroById(parseInt(id_ep));
  
  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <main className="container mx-auto px-4 py-8 ">
        <h1 className="text-3xl font-bold mb-6 mt-20">Editar Género</h1>
        <form className="max-w-md" action={updateGenre}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Nombre del Género
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={genero.nombre}
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
              defaultValue={genero.descripcion}
              className="w-full bg-[#333] border-none text-white"
              rows={4}
            />
          </div>
          <input type="hidden" name="id_genero" value={genero.id_genero} />
          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
            Actualizar Género
          </Button>
        </form>
      </main>
    </div>
  )
}