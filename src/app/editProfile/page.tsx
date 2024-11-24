import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const avatars = [
  '/placeholder.svg?height=150&width=150&text=1',
  '/placeholder.svg?height=150&width=150&text=2',
  '/placeholder.svg?height=150&width=150&text=3',
  '/placeholder.svg?height=150&width=150&text=4',
  '/placeholder.svg?height=150&width=150&text=5',
  '/placeholder.svg?height=150&width=150&text=6',
]

// En una aplicación real, estos datos vendrían de una base de datos
const existingProfile = {
  id: '1',
  nickname: 'Usuario Ejemplo',
  avatar: '/placeholder.svg?height=150&width=150&text=1'
}

export default function EditProfile() {
  async function updateProfile(formData: FormData) {
    'use server'
    
    const nickname = formData.get('nickname')
    const avatar = formData.get('avatar')
    
    // Aquí iría la lógica para actualizar el perfil en la base de datos
    console.log('Perfil actualizado:', { id: existingProfile.id, nickname, avatar })
    
    // Simular un retraso para la actualización
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // En una aplicación real, aquí redirigirías al usuario
    // return redirect('/profiles')
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl md:text-5xl font-bold mb-8">Editar perfil</h1>
      <div className="w-full max-w-md">
        <form action={updateProfile} className="space-y-6">
          <div>
            <Label htmlFor="nickname" className="text-gray-400">Apodo</Label>
            <Input
              id="nickname"
              name="nickname"
              type="text"
              defaultValue={existingProfile.nickname}
              className="mt-1 bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>
          <div>
            <Label className="text-gray-400 block mb-2">Elige un avatar</Label>
            <div className="grid grid-cols-3 gap-4">
              {avatars.map((avatar, index) => (
                <div key={index} className="relative">
                  <input
                    type="radio"
                    id={`avatar-${index}`}
                    name="avatar"
                    value={avatar}
                    defaultChecked={avatar === existingProfile.avatar}
                    className="sr-only peer"
                    required
                  />
                  <label
                    htmlFor={`avatar-${index}`}
                    className="block rounded-md overflow-hidden cursor-pointer transition-all duration-200 peer-checked:ring-4 peer-checked:ring-red-600 hover:ring-2 hover:ring-white"
                  >
                    <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-auto" />
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
              Guardar cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}