import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash } from 'lucide-react'
import { api_UsuariosYSuscripciones } from "@/lib/config";
import axios from "axios";
import { redirect } from "next/navigation";

interface planes{
  id_plan: number;
  nombre_plan: string;
  precio: number;
  descripcion: string;
  
}
async function getPlanes() {
  // This would be a server-side fetch in a real application
  const response = await axios.get(api_UsuariosYSuscripciones + 'planes');
  return response.data;
}

async function handleDelete(formData:FormData) {
  'use server';
  const id_plan=formData.get('id_plan');
  // This would be a server-side fetch in a real application
  const response = await axios.delete(api_UsuariosYSuscripciones + 'planes/'+id_plan);
  redirect('/admin')
  return response.data;
}

export default async function PlanesTab() {
  const planes = await getPlanes()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestión de Planes</h2>
        <div className="flex justify-end">
        <a href="/suscriptions/add">
          <Button
            variant="default"
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center rounded-full p-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Añadir Plan
          </Button>
        </a>
      </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-700">
            <TableHead className="text-gray-300">ID</TableHead>
            <TableHead className="text-gray-300">Nombre</TableHead>
            <TableHead className="text-gray-300">Precio</TableHead>
            <TableHead className="text-gray-300">Descripcion</TableHead>
            <TableHead className="text-gray-300">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {planes.map((plan: planes) => (
            <TableRow key={plan.id_plan} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
              <TableCell>{plan.id_plan}</TableCell>
              <TableCell className="font-medium">{plan.nombre_plan}</TableCell>
              <TableCell>{plan.descripcion}</TableCell>
              <TableCell>{plan.precio} €</TableCell>
            
              <TableCell>
                <div className="flex space-x-2">
                <a href={"/suscriptions/edit/"+plan.id_plan} >
                  <Button variant="ghost" size="icon" className="hover:bg-gray-700">
                    <Edit className="h-4 w-4 text-blue-400" />
                  </Button>
                </a>
                <form action={handleDelete}>
                  <input type="hidden" name="id_plan" value={plan.id_plan} />
                  <Button variant="ghost" size="icon" className="hover:bg-gray-700">
                    <Trash className="h-4 w-4 text-red-400" />
                  </Button>
                </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}