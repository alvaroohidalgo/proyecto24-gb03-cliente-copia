import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { api_UsuariosYSuscripciones } from "@/lib/config"
import axios from "axios"
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


const login = async (formData: FormData) => {
    'use server'
    const email = formData.get('email')
    const password = formData.get('password')
    console.log(email, password)
    var success = false
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('session');
        console.log(JSON.parse(session?.value || '{}'))
        if (!session) {
            // Redirige al usuario a la página de login si no hay sesión

            const response = await axios.get(api_UsuariosYSuscripciones + 'login?username=' + email + '&password=' + password)
            success = response.data
            console.log("SESION:\n",success)
            if(success){
                cookieStore.set('session',JSON.stringify({
                    'id_user':response.data.id,
                    'nombre':response.data.nombre,
                    'apellido':response.data.apellido,
                    'role':response.data.role
                }))
            }
        }else{
            success = true
        }
        console.log(session)
    } catch (error) {
        console.error(error)
    }
    if (success) {
        redirect('/profiles')
    }

}

export default async function LoginPage() {

    return (
        <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-50 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
            <div className="bg-black bg-opacity-70 p-8 rounded-md w-full max-w-md">
                <h1 className="text-white text-3xl font-bold mb-8">Iniciar sesión</h1>
                <form action={login} className="space-y-6">
                    <div>
                        <Input
                            type="email"
                            name="email"
                            placeholder="Email o número de teléfono"
                            className="w-full bg-[#333] text-white border-none rounded px-5 py-3.5 placeholder-[#8c8c8c]"
                        />
                    </div>
                    <div>
                        <Input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            className="w-full bg-[#333] text-white border-none rounded px-5 py-3.5 placeholder-[#8c8c8c]"
                        />
                    </div>
                    <Button type="submit" className="w-full bg-[#e50914] hover:bg-[#f40612] text-white py-3 rounded font-bold">
                        Iniciar sesión
                    </Button>
                    <div className="flex items-center justify-between text-[#b3b3b3] text-sm">
                        <div className="flex items-center">
                            <Checkbox id="remember" name="remember" className="border-[#b3b3b3]" />
                            <label htmlFor="remember" className="ml-2 text-sm">Recuérdame</label>
                        </div>
                        <a href="/register" className="hover:underline">Registrate aquí</a>
                    </div>
                </form>
               
            </div>
        </div>
    )
}