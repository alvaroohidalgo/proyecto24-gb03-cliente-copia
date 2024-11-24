
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api_UsuariosYSuscripciones } from "@/lib/config"
import { usuarioType } from '@/lib/types'
import axios from "axios"
import { redirect } from 'next/navigation';
import { cookies } from "next/headers"

export default async function EditarPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  const sessionValue = session?.value;
  const sessionJson = JSON.parse(sessionValue || '{}')
  const id = sessionJson.id_user
  async function handleSubmit(formData: FormData) {
    'use server'
    // Aquí iría la lógica de registro del usuario
    const nombre = formData.get('nombre')
    const apellido = formData.get('apellido')
    const email = formData.get('email')
    const password = formData.get('password')
    const role = formData.get('role')
    console.log('Registrando usuario:', { nombre, apellido, email, password })
    
    // Crear un nuevo usuario
    const nuevoUsuario: usuarioType = {
      nombre: nombre as string,
      apellido: apellido as string,
      email: email as string,
      password: password as string,
      id: parseInt(id),
      role: role as string
    }

    let existeError = false
    // Guardar el usuario en la base de datos
    try {
      const response = await axios.put(api_UsuariosYSuscripciones+"usuarios", nuevoUsuario)
      if(response.status !== 204)
        existeError = true
    } catch (error) {
      console.error('Error al guardar el usuario:', error)
      existeError = true
    }
    if(!existeError)
      redirect('/')
    else 
      redirect('/editUser/'+id)
  }

  


  let user:usuarioType = {
    nombre: '',
    apellido: '',
    email: '',
    password: ''
  }
  try{
    user = (await axios.get(api_UsuariosYSuscripciones+"usuarios/"+id)).data
  }catch(error){
    console.error('Error al obtener el usuario:', error)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
        
      <main className="w-full max-w-md p-8 bg-white rounded">
        <h1 className="text-4xl font-bold mb-6 text-black">Edita tu cuenta</h1>
        <p className="text-lg mb-6 text-gray-700">
          Solo unos pasos más y listo.
          <br />
          Cambia tus datos fácil y rápido.
        </p>
        <form action={handleSubmit} className="space-y-4">
         
          <Input
            type="text"
            name="nombre"
            placeholder="Nombre"
            defaultValue={user?.nombre}
            required
            className="w-full px-4 py-3 text-lg bg-white border border-gray-300 rounded focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          <Input
            type="text"
            name="apellido"
            placeholder="Apellido"
            defaultValue={user?.apellido}
            required
            className="w-full px-4 py-3 text-lg bg-white border border-gray-300 rounded focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            defaultValue={user?.email}
            required
            className="w-full px-4 py-3 text-lg bg-white border border-gray-300 rounded focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          <Input
            type="password"
            name="password"
            placeholder="Contraseña"
            defaultValue={user?.password}
            required
            className="w-full px-4 py-3 text-lg bg-white border border-gray-300 rounded focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          <div className="w-full px-4 py-3 text-sm  bg-white border border-gray-300 rounded focus:border-red-500 focus:ring-1 focus:ring-red-500">
            <label htmlFor="role" className="block text-gray-700">Rol</label>
            <select
              name="role"
              id="role"
              defaultValue={user?.role}
              required
              className="w-full mt-1 p-3 bg-white border border-gray-300 rounded focus:border-red-500 focus:ring-1 focus:ring-red-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <Button type="submit" className="w-full bg-[#e50914] hover:bg-[#f40612] text-white text-lg py-3 rounded font-semibold">
            Guardar
          </Button>
        </form>
      </main>
     </div>
    )
}