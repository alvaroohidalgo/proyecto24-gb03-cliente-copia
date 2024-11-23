import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash, Search } from 'lucide-react';
import { api_UsuariosYSuscripciones } from "@/lib/config";
import axios from "axios";
import { redirect } from 'next/navigation'

interface usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  role: string;
}

async function getUsers() {
  // Fetching the users data from the API using axios
  const response = await axios.get(api_UsuariosYSuscripciones + 'usuarios');
  return response.data; // We return the data directly, which should be an array of users
}


async function handleDelete(formData: FormData) {
  'use server'
  const userId = formData.get('userId')
  // Aquí iría la lógica para eliminar el género de la base de datos
  axios.delete(api_UsuariosYSuscripciones + 'usuarios/' + userId)
  // Redireccionar o recargar la página después de la eliminación
  redirect('/admin')
}
export default async function UsersTab() {
  const users = await getUsers(); // This will be an array of users

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestión de Usuarios</h2>
        <div className="flex items-center space-x-4">
          <Input
            type="search"
            placeholder="Buscar usuarios..."
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <Search className="mr-2 h-4 w-4" /> Buscar
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-700">
            <TableHead className="text-gray-300">ID</TableHead>
            <TableHead className="text-gray-300">Nombre</TableHead>
            <TableHead className="text-gray-300">Apellido</TableHead>
            <TableHead className="text-gray-300">Email</TableHead>
            <TableHead className="text-gray-300">Rol</TableHead>
            <TableHead className="text-gray-300">Contraseña</TableHead>
            <TableHead className="text-gray-300">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user: usuario) => (
            <TableRow key={user.id} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
              <TableCell>{user.id}</TableCell>
              <TableCell className="font-medium">{user.nombre}</TableCell>
              <TableCell className="font-medium">{user.apellido}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.password}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                <form action={handleDelete}>
                <input type="hidden" name="userId" value={user.id} />
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
  );
}
