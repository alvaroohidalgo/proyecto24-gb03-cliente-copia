import { IfaceContenidosDesc } from './page'
import Link from 'next/link'

interface IfaceActor {
    id: number;
    nombre: string;
    apellidos: string;
    descripcion: string;    
    imagen_url: string;
    fecha_nac: string;
}
function formatearFecha(fechaString: string): string {
    // Crear una nueva instancia de Date a partir de la cadena
    const fecha = new Date(fechaString);

    // Verificar que la fecha sea válida
    if (isNaN(fecha.getTime())) {
        throw new Error("Fecha inválida");
    }

    // Array con los nombres de los meses en español
    const meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    // Extraer día, mes y año
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();

    // Devolver la fecha formateada
    return `${dia} de ${mes} de ${anio}`;
}


export default function Desc_actores({ actor, contenidos }: { actor: IfaceActor, contenidos: IfaceContenidosDesc[] }) {
    return (
          
          <div className="min-h-screen bg-black text-white p-8">
          <h1 className="text-4xl font-bold text-center mb-8 mt-8">{actor.nombre} {actor.apellidos}</h1>
          <h4 className="text-lg font-medium text-center mb-4 mt-4">Fecha nacimiento: {formatearFecha(actor.fecha_nac)}</h4>
          <div className="flex justify-center mb-8">
            <img
              src={actor.imagen_url}
              alt={actor.nombre}
              className="rounded-full transition-transform duration-200 group-hover:scale-105 object-cover w-[200px] h-[200px]"
            />
          </div>
          <h4 className="text-xl font-semibold text-center mb-4 mt-4">{actor.descripcion}</h4>
          {/* Featured Content */}
          <h1 className="text-4xl font-bold text-center mb-8 mt-8">Películas relacionadas con {actor.nombre} {actor.apellidos}</h1>
  
          {/* Content Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
  
          {contenidos.map((contenido) => (
              <Link href={`/contenido/${contenido.id_contenido}`} key={contenido.id_contenido}>
              <div className="relative group cursor-pointer">
                  <img
                  src={contenido.portada_url}
                  alt={contenido.titulo}
                  width={300}
                  height={450}
                  className="rounded-md transition-transform duration-200 group-hover:scale-105 h-[150px] object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-200 flex items-end justify-center">
                  <div className="text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <h2 className="text-lg font-semibold">{contenido.titulo}</h2>
                      <p className="text-sm">{new Date(contenido.fecha_lanzamiento).getFullYear()}</p>
                  </div>
                  </div>
              </div>
              </Link>
          ))}
          </div>
          </div>
          )
  }
// export default function Desc_actores({ actor, contenidos }: { actor: IfaceActor, contenidos: IfaceContenidosDesc[] }) {
//     return (
//         <div className="min-h-screen bg-black text-white p-8">
//             {/* Featured Content */}
//             <h1 className="text-4xl font-bold text-center mb-8 mt-8">Películas relacionadas con {actor.nombre}</h1>

//             {/* Content Grid */}
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//                 {contenidos.map((contenido) => (
//                     <Link href={/contenido/${contenido.id_contenido}} key={contenido.id_contenido}>
//                         <div className="relative group cursor-pointer">
//                             <img
//                                 src={contenido.portada_url}
//                                 alt={contenido.titulo}
//                                 width={300}
//                                 height={450}
//                                 className="rounded-md transition-transform duration-200 group-hover:scale-105"
//                             />
//                             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-200 flex items-end justify-center">
//                                 <div className="text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                                     <h2 className="text-lg font-semibold">{contenido.titulo}</h2>
//                                     <p className="text-sm">{new Date(contenido.fecha_lanzamiento).getFullYear()}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </Link>
//                 ))}
//             </div>
//         </div>
//     )
// }