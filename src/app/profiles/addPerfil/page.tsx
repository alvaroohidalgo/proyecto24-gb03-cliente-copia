import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api_UsuariosYSuscripciones } from "@/lib/config"
import axios from "axios"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"



const avatars = [
  '/images/avatar1.webp',
  '/images/avatar2.webp',
  '/images/avatar3.webp',
  '/images/avatar4.webp',
  '/images/avatar5.webp',
  '/images/avatar6.webp',
]

export default function AddProfile() {
  async function createProfile(formData: FormData) {
    'use server'
    
    const apodo = formData.get('apodo')
    const avatar_imagen = formData.get('avatar')
    
    console.log('Nuevo perfil:', { apodo, avatar_imagen })
    
    // Redirigir o mostrar un mensaje de éxito
    // Por ahora, solo simularemos un retraso
    try{
      const cookieStore = await cookies();
      const session = cookieStore.get('session');
      const json_ses = JSON.parse(session?.value || '{}')
      console.log(json_ses)
      await axios.post(api_UsuariosYSuscripciones+'usuarios/perfiles',{
        id_usuario: json_ses.id_user,
        apodo: apodo,
        imagen_avatar: avatar_imagen
      })
    
    }catch(error){
      console.error(error)
    }
    redirect('/profiles')
    
    // En una aplicación real, aquí redirigirías al usuario
    // return redirect('/profiles')
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl md:text-5xl font-bold mb-8">Añadir perfil</h1>
      <div className="w-full max-w-md">
        <form action={createProfile} className="space-y-6">
          <div>
            <Label htmlFor="nickname" className="text-gray-400">Apodo</Label>
            <Input
              id="nickname"
              name="apodo"
              type="text"
              className="mt-1 bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>
          <div>
            <Label className="text-gray-400 block mb-2">Elige un avatar</Label>
            <div className="grid grid-cols-3 gap-4">
              {avatars.map((avatar, index) => (
                <div key={index} className="relative hover:scale-105 transition-transform duration-300">
                  <input
                    type="radio"
                    id={`avatar-${index}`}
                    name="avatar"
                    value={avatar}
                    className="sr-only peer"
                    required
                  />
                  <label
                    htmlFor={`avatar-${index}`}
                    className="block rounded-md overflow-hidden cursor-pointer transition-all duration-200 peer-checked:ring-4 peer-checked:ring-red-600 hover:ring-2 hover:ring-white"
                  >
                    <img src={avatar} alt={`Avatar ${index + 1}`} 
                    className="w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded-md object-cover  "/>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <Button type="button" variant="outline" className="bg-transparent border-gray-600 text-gray-400 hover:bg-gray-800">
              Cancelar
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              Guardar perfil
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}