import { cookies } from 'next/headers';
import { PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { api_UsuariosYSuscripciones } from '@/lib/config';
import { perfilType } from '@/lib/types';
import { redirect } from 'next/navigation';
import Link from 'next/link';


const eliminarPerfil = async (formData:FormData) => {
  'use server'
  const id_perfil = formData.get('id_perfil')
  console.log(id_perfil)
  try{
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if(session){
      // Borrar la cookie de sesión anterior
      cookieStore.delete('session')
      // Redirige al usuario a la página de login si no hay sesión
      const json_ses = JSON.parse(session?.value || '{}')
      // Creamos un nuevo objeto de sesión sin el perfil eliminado
      const nueva_sesion = {
        'id_user':json_ses.id_user,
        'nombre':json_ses.nombre,
        'apellido':json_ses.apellido
    }
      cookieStore.set('session',JSON.stringify(nueva_sesion))
      
      await axios.delete(api_UsuariosYSuscripciones + 'usuarios/perfiles/'+ id_perfil)
    }
  }catch(error){
    console.error(error)
  }
  redirect('/profiles')
}


const usarPerfil= async (formData:FormData) => {
  'use server'
  const id_perfil = formData.get('id_perfil')
  const apodo = formData.get('apodo')
  const imagen_avatar = formData.get('imagen_avatar')
  console.log(id_perfil)
  try{
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if(session){
      // Borrar la cookie de sesión anterior
      cookieStore.delete('session')
      // Redirige al usuario a la página de login si no hay sesión
      const json_ses = JSON.parse(session?.value || '{}')
      
      console.log(json_ses) 
      const nueva_sesion = {
        'id_user':json_ses.id_user,
        'nombre':json_ses.nombre,
        'apellido':json_ses.apellido,
        'id_perfil':id_perfil,
        'apodo':apodo,
        'imagen_avatar':imagen_avatar,
        'role':json_ses.role
    }
    console.log(nueva_sesion)
      cookieStore.set('session',JSON.stringify(nueva_sesion))
    }
  }catch(error){
    console.error(error)
  }
  redirect('/')
}



export default async function Component() {


  const obtenerPerfiles = async () => {
    try{
      const cookieStore = await cookies();
      const session = cookieStore.get('session');
      if(session){
        // Redirige al usuario a la página de login si no hay sesión
        const json_ses = JSON.parse(session?.value || '{}')
        const id = json_ses.id_user
        const response = await axios.get(api_UsuariosYSuscripciones + 'usuarios/'+ id +'/perfiles' )
        return response.data
      }
    }catch(error){
      console.error(error)
    }
  }

  const perfiles:perfilType[] = await obtenerPerfiles()
  console.log(perfiles)



  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl md:text-5xl font-bold mb-8">¿Quién está viendo ahora?</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-8">
        {perfiles && perfiles.map((profile) => (
          <div key={profile.id} className='flex flex-col'>
            <form  action={usarPerfil}>
            <input type="hidden" name="id_perfil" value={profile.id}/>
            <input type="hidden" name="apodo" value={profile.apodo}/>
            <input type="hidden" name="imagen_avatar" value={profile.imagen_avatar}/>
            <button
              type="submit"
              className={`flex flex-col items-center transition-transform duration-200 ease-in-out
                hover:scale-105`}
            >
              <img
                src={profile.imagen_avatar}
                alt={`Avatar de ${profile.apodo}`}
                className="w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded-md object-cover mb-2"
              />
              <span className="text-gray-400 text-sm md:text-lg">{profile.apodo}</span>
            </button>
            </form>
            <Link href={`/profiles/editPerfil/${profile.id}`}className='flex my-2'>
            <input type="hidden" name="id_perfil" value={profile.id}/>
            <Button type="submit" className="bg-white text-gray-900 mx-auto w-full hover:bg-gray-300">Editar</Button>
            </Link>
            <form className='flex my-2' action={eliminarPerfil}>
            <input type="hidden" name="id_perfil" value={profile.id}/>
            <Button type="submit" className="bg-red-500 text-white mx-auto w-full hover:bg-red-700">Eliminar</Button>
            </form>
          </div>
        ))}
        <Link href="/profiles/addPerfil"
          className="flex flex-col items-center justify-center w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded-md border-2 border-gray-600 hover:border-gray-400 transition-colors duration-200 ease-in-out"
          aria-label="Agregar perfil"
        >
          <PlusCircle className="w-12 h-12 md:w-16 md:h-16 text-gray-600" />
          <span className="text-gray-400 text-sm md:text-lg mt-2">Agregar perfil</span>
        </Link>
        
      </div>

    </div>
  )
}