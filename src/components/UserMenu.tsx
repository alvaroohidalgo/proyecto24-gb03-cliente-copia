'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { LogOut } from 'lucide-react'
import logout from '@/app/login/action-logout'

interface UserMenuProps {
  nombre: string
  apellido: string
  role?: string
}

export default function UserMenu({ nombre, apellido, role}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false) 
  const onLogout = async () => {
    await logout()
  }
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="p-0 h-auto w-auto">
          <Avatar>
            <AvatarFallback>{nombre.charAt(0)}{apellido.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2 pt-4">
        <div className="flex flex-col space-y-2">
          <div className='bg-gray-800 p-2 rounded-xl'>
              <p className="text-sm font-semibold text-white text-center ">
                {nombre} {apellido}
              </p>
          </div>
          {role == 'admin' && <div className='bg-red-500 p-2 rounded-xl'>
            <a href="/admin" className="text-white text-center">
              <p className="text-sm font-semibold text-white text-center ">
                Panel de administrador
              </p>
            </a>
          </div>}
          <div className='bg-gray-800 p-2 rounded-xl'>
            <a href="/editUser" className="text-white text-center">
              <p className="text-sm font-semibold text-white text-center ">
                Editar cuenta
              </p>
            </a>
          </div>
          <div className='bg-gray-800 p-2 rounded-xl'>
            <a href="/mySuscriptions" className="text-white text-center">
              <p className="text-sm font-semibold text-white text-center ">
                Gestionar Suscripciones
              </p>
            </a>
          </div>
          <div className='bg-gray-800 p-2 rounded-xl'>
            <a href="/suscriptions" className="text-white text-center">
              <p className="text-sm font-semibold text-white text-center ">
                Adquirir Nueva Subscripción
              </p>
            </a>
          </div>
          <div className='bg-gray-800 p-2 rounded-xl'>
            <a href="/favoritos" className="text-white text-center">
              <p className="text-sm font-semibold text-white text-center ">
                Mis series y peliculas
              </p>
            </a>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900"
            onClick={() => {
              onLogout()
              setIsOpen(false)
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}