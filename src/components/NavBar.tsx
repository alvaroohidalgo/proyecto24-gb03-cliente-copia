import Link from 'next/link'
import Image from 'next/image'
import { Bell, Search } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cookies } from 'next/headers'
import { sessionType } from '@/lib/types'
import UserMenu from './UserMenu'
import ProfileCard from './ProfileCard'
import Buscador from './Buscador'


const navItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Series TV', href: '/series' },
    { name: 'Películas', href: '/peliculas' },
    { name: 'Novedades populares', href: '/nuevo-y-popular' },
    { name: 'Mi lista', href: '/favoritos' },
    { name: 'Explora por idiomas', href: '/idiomas' },
]

export default async function Navbar() {
    const session = await cookies();
    const sessionValue = session.get('session');
    const sessionJson: sessionType = JSON.parse(sessionValue?.value || '{}')

    return (
        <nav className="fixed top-0 z-50 w-full bg-gradient-to-b from-black/75 to-transparent px-4 py-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    <Link href="/">
                        <Image
                            src="/images/Logo-Netflix.png"
                            alt="Netflix"
                            width={92}
                            height={28}
                            className="cursor-pointer"
                        />
                    </Link>
                    <ul className="hidden md:flex space-x-4">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className="text-md text-gray-200 font-semibold hover:text-gray-300 transition-colors"
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex items-center space-x-4">
                    <Buscador/>
                    <Button variant="ghost" size="icon" className="text-gray-200 hover:text-gray-300">
                        <Bell className="h-7 w-7" />
                    </Button>
                    {sessionJson.id_user ? 
                    <div className='flex space-x-4'>
                        {sessionJson.id_perfil?
                        <ProfileCard apodo={sessionJson.apodo} imagen_avatar={sessionJson.imagen_avatar} />
                        : null}
                        <UserMenu
                            nombre={sessionJson.nombre}
                            apellido={sessionJson.apellido}
                            role={sessionJson.role}
                        />
                    </div>
                        : <Link href="/login">
                            <Button className='bg-red-500 text-white font-semibold'>Iniciar sesión</Button>
                        </Link>
                    }
                </div>
            </div>
        </nav>
    )
}