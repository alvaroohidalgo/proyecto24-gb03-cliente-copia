import Image from 'next/image'
import Link from 'next/link'
import { MovieCarousel } from '@/components/MovieCarousel'
import axios from 'axios'
import { api_Contenido, api_Personalizacion} from '@/lib/config'
import { IfaceMovie } from '@/components/MovieCarousel'
import { contenidoDescType } from '@/lib/types'
import { cookies } from 'next/headers';






export default async function Home() {
  let id_perfil=0;
  try{
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if(session){
      // Redirige al usuario a la página de login si no hay sesión
      const json_ses = JSON.parse(session?.value || '{}');
      id_perfil = Number(json_ses.id_perfil);
      console.log("El perfil es "+id_perfil)
    } 
  }catch(error){
    console.error(error)
  }
  const favoritos = (await axios.get(api_Personalizacion+"favoritos?id_perfil="+id_perfil)).data;
  let movies:contenidoDescType[] = [];
    for (let i = 0; i < favoritos.length; i++) {
        movies.push((await axios.get(api_Contenido+"contenidos/"+favoritos[i].id_contenido)).data);
    }
    const historial = (await axios.get(api_Personalizacion+"historial/perfil/"+id_perfil)).data;
    let movies2:contenidoDescType[] = [];
    for (let i = 0; i < historial.length; i++) {
        movies2.push((await axios.get(api_Contenido+"contenidos/"+historial[i].id_contenido)).data);
    }
  
  return (
    <div className="min-h-screen bg-black text-white">
      
        <section className="pt-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold ">Favoritos</h2>
            <MovieCarousel movies={movies} />
          </div>
        </section>


        <section className="py-2">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold ">Tu historial</h2>
            <MovieCarousel movies={movies2} />
          </div>
        </section>
  

 
    </div>
  )
}