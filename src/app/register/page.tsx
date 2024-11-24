
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api_UsuariosYSuscripciones } from "@/lib/config"
import { usuarioType } from '@/lib/types'
import axios from "axios"
import { redirect } from 'next/navigation';


export default async function RegistroPage({searchParams}:{searchParams:Promise<{error?:string}>}) {
  async function handleSubmit(formData: FormData) {
    'use server'
    // Aquí iría la lógica de registro del usuario
    const nombre = formData.get('nombre')
    const apellido = formData.get('apellido')
    const email = formData.get('email')
    const password = formData.get('password')
    console.log('Registrando usuario:', { nombre, apellido, email, password })
    
    // Crear un nuevo usuario
    const nuevoUsuario: usuarioType = {
      nombre: nombre as string,
      apellido: apellido as string,
      email: email as string,
      password: password as string
    }

    let existeError = false
    // Guardar el usuario en la base de datos
    try {
      const response = await axios.post(api_UsuariosYSuscripciones+"usuarios", nuevoUsuario)
      if(response.status !== 201)
        existeError = true
    } catch (error) {
      console.error('Error al guardar el usuario:', error)
      existeError = true
    }
    if(!existeError)
      redirect('/login')
    else 
      redirect('/register?error=true')
  }

  const {error} = await searchParams;
  console.log(error)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
        
      <main className="w-full max-w-md p-8 bg-white rounded">
        <h1 className="text-4xl font-bold mb-6 text-black">Crea una cuenta</h1>
        <p className="text-lg mb-6 text-gray-700">
          Solo unos pasos más y listo.
          <br />
          Tampoco nos gusta el papeleo.
        </p>
        <form action={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500">Error al registrar el usuario</p>}
          <Input
            type="text"
            name="nombre"
            placeholder="Nombre"
            required
            className="w-full px-4 py-3 text-lg bg-white border border-gray-300 rounded focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          <Input
            type="text"
            name="apellido"
            placeholder="Apellido"
            required
            className="w-full px-4 py-3 text-lg bg-white border border-gray-300 rounded focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full px-4 py-3 text-lg bg-white border border-gray-300 rounded focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          <Input
            type="password"
            name="password"
            placeholder="Contraseña"
            required
            className="w-full px-4 py-3 text-lg bg-white border border-gray-300 rounded focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          <Button type="submit" className="w-full bg-[#e50914] hover:bg-[#f40612] text-white text-lg py-3 rounded font-semibold">
            Siguiente
          </Button>
        </form>
      </main>
     </div>
    )
}


