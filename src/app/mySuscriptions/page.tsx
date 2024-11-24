import { Metadata } from 'next'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle } from 'lucide-react'
import axios from 'axios'
import { api_UsuariosYSuscripciones } from '@/lib/config'
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
      


export const metadata: Metadata = {
  title: 'Mis Suscripciones | StreamFlix',
  description: 'Gestiona tus suscripciones de StreamFlix',
}

async function getSubscriptions(id_user: number): Promise<Subscription[]> {
  // Simular una llamada a la API o base de datos
  try {
    // Realizar la llamada a la API
    const response = await axios.get(`${api_UsuariosYSuscripciones}suscripciones/${id_user}`);

    // Asegúrate de mapear los datos a la interfaz Subscription
    const subscriptions: Subscription[] = response.data.map((sub: any) => ({
      id_suscription: sub.id_subscription,
      id_usuario: sub.id_usuario,
      id_plan: sub.id_plan,
      fecha_inicio: sub.fecha_inicio,
      fecha_fin: sub.fecha_fin,
      estado: sub.estado,
    }));

    return subscriptions;
  } catch (error) {
    console.error("Error al obtener las suscripciones:", error);
    return []; // Retorna un arreglo vacío en caso de error
  }
}

async function handleDelete(formData: FormData) {
    'use server'; // Esto asegura que la función se ejecute en el servidor
    try {
      const id = parseInt(formData.get('id_suscription') as string, 10);
      if (!id) throw new Error('ID de suscripción no proporcionado.');
  
      // Realiza la solicitud para eliminar la suscripción
      await axios.delete(`${api_UsuariosYSuscripciones}suscripciones/${id}`);
  
      console.log(`Suscripción con ID ${id} eliminada exitosamente.`);
  
      // Redirige después de eliminar
      redirect('/mySuscriptions');
    } catch (error) {
      console.error('Error al eliminar la suscripción:', error);
      throw error; // Asegúrate de manejar este error correctamente en tu flujo
    }
  }
  

export default async function SubscriptionsPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    const json_ses = JSON.parse(session?.value || '{}');
    const id_user = json_ses.id_user;
  const subscriptions = await getSubscriptions(id_user)
  const planes = await getPlanes();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8 pt-20">
        <h1 className="text-4xl font-bold mb-8 text-center">Mis Suscripciones</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {subscriptions.map((sub: Subscription) => {
    const plan = planes.find((plan) => plan.id_plan === sub.id_plan);
    return (
      <Card key={sub.id_suscription} className="bg-gray-800 border-gray-700 overflow-hidden">
        
        <CardContent className="pt-4 text-white">
          <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-2xl">{plan?.nombre_plan}</CardTitle>
            <Badge
              className={`${
                sub.estado === 'Activo' ? 'bg-green-500' : 'bg-red-500'
              } text-sm px-2 py-1`}
            >
              {sub.estado === 'Activo' ? 'Activo' : 'Cancelado'}
            </Badge>
          </div>
          <CardDescription>
            <p className="mb-2 text-gray-400"> {/* Próximo cobro se mantiene gris */}
              Próximo cobro: {sub.fecha_fin}
            </p>
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-between items-center text-white">
          <p className="text-2xl font-bold">{plan?.precio}€/mes</p>
          {sub.estado === 'Activo' && (
            <form action={handleDelete}>
                <input type="hidden" name="id_suscription" value={String(sub.id_suscription)} />
                <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded"
                >
                Cancelar
                </button>
            </form>
            )}

        </CardFooter>
      </Card>
    );
  })}
</div>


        
      </div>
    </div>
  )
}