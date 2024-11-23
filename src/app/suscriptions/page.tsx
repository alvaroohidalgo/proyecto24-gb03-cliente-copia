import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { api_Contenido, api_UsuariosYSuscripciones } from '@/lib/config';
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';

interface Plan {
  id_plan: number;
  nombre_plan: string;
  precio: number;
  descripcion: string;
}

async function getPlanes(): Promise<Plan[]> {
  try {
    // Realiza la solicitud a la API
    const response = await axios.get(api_UsuariosYSuscripciones + 'planes');

    // Asegúrate de que los datos cumplen con la estructura de la interfaz Plan
    const planes: Plan[] = response.data.map((plan: any) => ({
      id_plan: plan.id_plan,
      nombre_plan: plan.nombre_plan,
      precio: plan.precio,
      descripcion: plan.descripcion
    }));

    return planes;
  } catch (error) {
    console.error('Error al obtener los planes:', error);
    return []; // Retorna un arreglo vacío en caso de error
  }
}

async function postSuscription(formData: FormData) {
  'use server';
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    const json_ses = JSON.parse(session?.value || '{}');
    const id_user = json_ses.id_user;

    if(!id_user)  {
      redirect('/login');
      return;

    }

    // Construye el objeto a partir de FormData
    const subscriptionData = {
      id_usuario: id_user,
      id_plan: parseInt(formData.get("id_plan") as string), // ID del plan seleccionado
      fecha_inicio: formData.get("fecha_inicio")as string, // Fecha de inicio
      fecha_fin: formData.get("fecha_fin") as string, // Fecha de fin
      estado: formData.get("estado") as string, // Estado de la suscripción
    };

    // Validar que se haya seleccionado un plan
    if (!subscriptionData.id_plan) {
      throw new Error("Debe seleccionar un plan antes de finalizar la suscripción.");
    }
    console.log(subscriptionData);
    // Enviar datos al backend usando Axios
    const response = await axios.post(api_UsuariosYSuscripciones+"suscripciones", subscriptionData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Manejo de la respuesta del backend
    console.log("Suscripción creada con éxito");
    redirect('/');
    return response.data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al enviar la suscripción:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "Error al procesar la suscripción.");
    } else if (error instanceof Error) {
      console.error("Error al enviar la suscripción:", error.message);
      throw error;
    } else {
      console.error("Error desconocido al enviar la suscripción:", error);
      throw new Error("Error desconocido al enviar la suscripción.");
    }
  }
}

export default async function SubscriptionPage() {
  const planes = await getPlanes();

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center p-4 md:p-8">
      <header className="w-full max-w-5xl mb-10">
        {/* Puedes agregar contenido en el header si es necesario */}
      </header>
      <main className="w-full max-w-5xl">
        <form action={postSuscription}>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Elige el plan ideal para ti</h1>
          <ul className="list-none p-0 mb-8">
            <li className="flex items-center mb-2">
              <Check className="text-red-600 mr-2" />
              <span>Ve todo lo que quieras. Sin anuncios.</span>
            </li>
            <li className="flex items-center mb-2">
              <Check className="text-red-600 mr-2" />
              <span>Recomendaciones exclusivas para ti.</span>
            </li>
            <li className="flex items-center">
              <Check className="text-red-600 mr-2" />
              <span>Cambia de plan o cancela cuando quieras.</span>
            </li>
          </ul>
          <div className="grid md:grid-cols-3 gap-6">
            {planes.map((plan: Plan) => (
              <div key={plan.id_plan} className="relative">
                {/* Input radio oculto */}
                <input
                  type="radio"
                  id={`plan-${plan.id_plan}`}
                  name="id_plan"
                  value={plan.id_plan}
                  className="hidden peer"
                  required
                />
                {/* Label que actúa como contenedor del plan */}
                <label
                  htmlFor={`plan-${plan.id_plan}`}
                  className="border rounded-lg p-4 flex flex-col h-full cursor-pointer border-gray-300 peer-checked:border-red-600 transition-colors duration-200"
                >
                  <h2 className="text-xl font-bold mb-2">{plan.nombre_plan}</h2>
                  <p className="text-2xl font-bold mb-4">{plan.precio}€/mes</p>
                  <p className="mb-4">{plan.descripcion}</p>
                  <div className="mt-auto flex justify-end">
                    {/* Botón visual, solo para estética */}
                    <span className="bg-red-600 text-white px-4 py-2 rounded inline-block text-center font-bold hover:bg-red-700">
                      Seleccionar
                    </span>
                  </div>
                </label>
              </div>
            ))}
          </div>

          {/* Campos ocultos adicionales */}
          <input type="hidden" name="fecha_inicio" value={new Date().toISOString().split('T')[0]} />
          <input
            type="hidden"
            name="fecha_fin"
            value={new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]}
          />
          <input type="hidden" name="estado" value="Activo" />

          {/* Botón de finalizar compra */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-md text-sm transition duration-300 ease-in-out"
            >
              Finalizar
            </button>
          </div>
        </form>
      </main>
      <footer className="w-full max-w-5xl mt-12 text-gray-600 text-sm">
        <p>
          La disponibilidad del contenido en HD (720p), Full HD (1080p), Ultra HD (4K) y HDR
          depende de tu servicio de internet y del dispositivo en uso. No todo el contenido
          está disponible en todas las resoluciones. Consulta nuestros Términos de uso para
          más información.
        </p>
        <p className="mt-2">
          Solo las personas que viven contigo pueden usar tu cuenta. Ve Netflix en 4
          dispositivos diferentes al mismo tiempo con el plan Premium, en 2 con el plan
          Estándar y en 1 con el plan Básico.
        </p>
      </footer>
    </div>
  );
}
