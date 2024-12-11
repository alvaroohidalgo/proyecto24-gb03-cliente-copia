import axios from 'axios';
import { notFound } from 'next/navigation'
import { PlayCircle, Info, Star, Clock, Calendar } from 'lucide-react'
import { api_Contenido, api_Personalizacion  } from '@/lib/config';
import { IfaceContenidoDesc } from './page';
import BotonReproducir from './BotonReproducir';
import FavoriteButton from './favorite-button';
import RatingButtons from './rating-buttons';
import { cookies } from 'next/headers';



interface Actor {
  id_actor: number;
  nombre: string;
  apellidos: string;
  fecha_nac: string;
  imagen_url: string;
  descripcion: string;
}

interface Genero {
  id_genero: number;
  nombre: string;
  descripcion: string;
}


async function getActores(id_contenido: number): Promise<Actor[]> {
  try {
    const response = await axios.get(api_Contenido+"contenidos/"+id_contenido+"/actores");
    return response.data;
  } catch (error) {
    console.error('Error fetching actores:', error);
    return [];
  }
}

async function getGeneros(id_contenido: number): Promise<Genero[]> {
  try {
    const response = await axios.get(api_Contenido+"contenidos/"+id_contenido+"/generos");
    return response.data;
  } catch (error) {
    console.error('Error fetching generos:', error);
    return [];
  }
}

async function getFavoriteStatus(id_perfil: number, id_contenido: number): Promise<{ isFavorite: boolean, favoriteId: number | null }> {
    try {
      const response = await fetch(api_Personalizacion+`favoritos?id_perfil=${id_perfil}`); //8082
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      const favorites = await response.json();
      const favorite = favorites.find((fav: any) => fav.id_contenido === id_contenido);
      return {
        isFavorite: !!favorite,
        favoriteId: favorite ? favorite.id_favorito : null
      };
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return { isFavorite: false, favoriteId: null };
    }
  }

  async function getRating(id_contenido: number, id_perfil: number) {
    try {
      const response = await fetch(api_Personalizacion+ `ratings/content/${id_contenido}`); //8082
      if (!response.ok) {
        throw new Error('Failed to fetch ratings');
      }
      const ratings = await response.json();
      const userRating = ratings.find((rating: any) => rating.id_perfil === id_perfil);
      return userRating ? { id_rating: userRating.id_rating, thumb_up: userRating.thumb_up } : { id_rating: null, thumb_up: null };
    } catch (error) {
      console.error('Error fetching rating:', error);
      return { id_rating: null, thumb_up: null };
    }
  }

  

export default async function Desc_contenido({ contenido }: { contenido: IfaceContenidoDesc }) {
    if (!contenido) {
        notFound()
    }
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
    const actores = await getActores(contenido.id_contenido);
    const generos = await getGeneros(contenido.id_contenido);
    const { isFavorite, favoriteId } = await getFavoriteStatus(id_perfil, contenido.id_contenido);
    const initialRating = await getRating(contenido.id_contenido, id_perfil);
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="relative">
                <div className="h-[56.25vw] relative">
                    <img
                        src={contenido.portada_url}
                        alt={contenido.titulo}
                        className='object-cover h-full w-full'
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                </div>
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 p-8 space-y-4 max-w-3xl">
                    <h1 className="text-5xl font-bold">{contenido.titulo}</h1>
                    <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center">
                           
                            {/* {contenido.calificacion} */}
                        </span>
                        <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {contenido.duracion} min
                        </span>
                        <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(contenido.fecha_lanzamiento).getFullYear()}
                        </span>
                        <span className="px-2 py-1 border border-white/40 rounded">
                            {contenido.tipo}
                        </span>
                    </div>
                    <p className="text-lg">{contenido.descripcion}</p>
                    <div className="flex items-center space-x-4">
                      
                        <BotonReproducir contenido={contenido} id_perfil={id_perfil} />
                      
                        <a
                            href={contenido.trailer_url}
                            className="flex items-center px-6 py-2 bg-gray-500/50 font-bold rounded hover:bg-gray-500/70 transition"
                        >
                            <Info className="w-5 h-5 mr-2" />
                            Más información
                        </a>
                        <FavoriteButton 
                    id_contenido={contenido.id_contenido} 
                    id_perfil={id_perfil} 
                    isFavorite={isFavorite} 
                    favoriteId={favoriteId}
                />
                   <RatingButtons
                    id_contenido={contenido.id_contenido}
                    id_perfil={id_perfil}
                    initialRating={initialRating}
                />
                    </div>
                </div>
            </div>
            <div className="p-8 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Reparto</h2>
                    <div className="flex flex-wrap gap-4">
                        {actores.map((actor) => (
                            <div key={actor.id_actor} className="flex items-center space-x-2">
                                <img src={actor.imagen_url} alt={actor.nombre} className="w-10 h-10 rounded-full object-cover" />
                                <a href={`/actores/${actor.id_actor}/contenidos`} className="hover:underline">
                                    <span>{actor.nombre} {actor.apellidos}</span>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-2">Géneros</h2>
                    <div className="flex flex-wrap gap-2">
                        {generos.map((genero) => (
                            <a 
                                key={genero.id_genero}
                                href={`/generos/${genero.id_genero}/contenidos`}
                                className="px-3 py-1 bg-gray-700 rounded-full text-sm hover:bg-gray-600 transition-colors"
                            >
                                {genero.nombre}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}