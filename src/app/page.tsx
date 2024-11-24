import Image from 'next/image'
import Link from 'next/link'
import { MovieCarousel } from '@/components/MovieCarousel'
import axios from 'axios'
import { api_Contenido, api_Personalizacion, api_UsuariosYSuscripciones } from '@/lib/config'
import { IfaceMovie } from '@/components/MovieCarousel'
import { contenidoDescType, generoType } from '@/lib/types'
import { cookies } from "next/headers";
import { redirect } from 'next/navigation'
  
   
interface Subscription {
  id_suscription: number
  id_usuario: number
  id_plan: number
  fecha_inicio: string
  fecha_fin: string
  estado: string
  }

interface Movie {
  id_contenido: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  fecha_lanzamiento: string;
  duracion: number;
  trailer_url: string;
  portada_url: string;
  stream_url: string;
}



async function getFeaturedMovie(): Promise<Movie> {
  const featuredMovies: Movie[] = (await axios.get(api_Contenido + "contenidos")).data;

  // Asegurarte de que la API devuelve un array y obtener el primer elemento
  if (Array.isArray(featuredMovies) && featuredMovies.length > 0) {
    // Numero aleatorio entre 0 y la longitud del array
    const randomIndex = Math.floor(Math.random() * featuredMovies.length);
    return featuredMovies[randomIndex];
  } else {
    throw new Error("No movies found in the API response.");
  }
}




async function controlarReproducir(formData: FormData){
  'use server';
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  const json_ses = JSON.parse(session?.value || '{}');
  const id_user = json_ses.id_user;
  const suscripciones= (await axios.get(api_UsuariosYSuscripciones+"usuarios/"+id_user+"/suscripcion")).data;
  console.log(suscripciones)
  if(suscripciones){
    const subscriptions: Subscription[] = suscripciones.map((sub: any) => ({
      id_suscription: sub.id_subscription,
      id_usuario: sub.id_usuario,
      id_plan: sub.id_plan,
      fecha_inicio: sub.fecha_inicio,
      fecha_fin: sub.fecha_fin,
      estado: sub.estado,
    }));
  
    const puede= subscriptions.some((sub) => sub.estado === 'Activo');
  
    if(!puede){
      redirect("/suscriptions")
    }
    else{
      redirect("/contenido/"+formData.get('id_contenido') as string)
    }
  }
  else{
    redirect("/suscriptions")
  }
  

}

export default async function Home() {

  const featuredMovie = await getFeaturedMovie();
  const movies = (await axios.get(api_Contenido+"contenidos")).data;
  const generos = (await axios.get(api_Contenido+"generos")).data;
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  let id_perfil=0;
  try{
    if(session){
      // Redirige al usuario a la página de login si no hay sesión
      const json_ses = JSON.parse(session?.value || '{}');
      id_perfil = Number(json_ses.id_perfil);
      console.log("El perfil es "+id_perfil)
    } 
  }catch(error){
    console.error(error)
  }
  const peliculas = (await axios.get(api_Personalizacion+'recomendaciones/'+id_perfil)).data;
  
    
    let peliculasPorGenero: { [key: string]: contenidoDescType[] } = {};
  generos.forEach((genero: generoType) => {
    peliculasPorGenero[genero.nombre] = movies.filter((movie: contenidoDescType) => {
      return movie.generos.map((g) => g.id_genero).includes(genero.id_genero);
    });
  });

  if (!session){
    redirect('/login');
  }
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      

      <main>
        <section className="relative h-screen">
          <img src={featuredMovie.portada_url || ''}  alt={featuredMovie.titulo} className='w-full h-screen object-cover' />
          <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent" />
          <div className="absolute bottom-0 left-0 p-16 w-1/2">
            <h1 className="text-5xl font-bold mb-4">{featuredMovie.titulo}</h1>
            <p className="text-lg mb-6">{featuredMovie.descripcion}</p>
            <div className="flex space-x-4">
              <form action={controlarReproducir}>
                <input type="hidden" name="id_contenido" value={String(featuredMovie.id_contenido)} />
              <button className="bg-white text-black px-8 py-2 rounded font-bold hover:bg-opacity-80 transition" >
                ▶ Play
              </button>
              </form>
              <button className="bg-gray-500 bg-opacity-50 text-white px-8 py-2 rounded font-bold hover:bg-opacity-40 transition">
                ℹ More Info
              </button>
            </div>
          </div>
        </section>
        <section className="pt-16 px-8">
          <div className="mx-auto px-4">
            <h2 className="text-2xl font-bold text-white">Peliculas Recien añadidas</h2>
            <MovieCarousel movies={movies} />
          </div>
        </section>

        <section className="pt-16 px-8">
          <div className="mx-auto px-4">
            <h2 className="text-2xl font-bold text-white">Recomendaciones para ti</h2>
            <MovieCarousel movies={peliculas} />
          </div>
        </section>

      
      </main>
      {Object.keys(peliculasPorGenero).map((genero) => (
          <section key={genero} className="px-8">
            <div className="mx-auto px-4">
              <h2 className="text-2xl font-bold text-white">{genero.charAt(0).toUpperCase() + genero.slice(1)}</h2>
              <MovieCarousel movies={peliculasPorGenero[genero]} />
            </div>
          </section>
        ))}
      <footer className="bg-black py-8">
        <div className="container mx-auto px-4">
          <p className="text-gray-500 text-sm text-center">
            © 2023 Netflix Clone. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

