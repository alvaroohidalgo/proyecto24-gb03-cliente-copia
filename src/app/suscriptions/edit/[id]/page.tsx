import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { api_UsuariosYSuscripciones } from '@/lib/config'

interface Plan {
  id_plan: number
  nombre_plan: string
  precio: number
  descripcion: string
}

async function getPlans(): Promise<Plan[]> {
  console.log('Fetching all plans...')
  try {
    const res = await fetch(api_UsuariosYSuscripciones+'planes', { cache: 'no-store' })
    if (!res.ok) {
      console.error('Failed to fetch plans:', res.statusText)
      return []
    }
    const plans = await res.json()
    return plans
  } catch (error) {
    console.error('Error fetching plans:', error)
    return []
  }
}

async function updatePlan(id: number, formData: FormData) {
  'use server'

  const rawFormData = Object.fromEntries(formData.entries())
  const planData: Plan = {
    id_plan: id,
    nombre_plan: rawFormData.nombre_plan as string,
    precio: parseFloat(rawFormData.precio as string),
    descripcion: rawFormData.descripcion as string,
  }

  console.log('Updating plan:', planData)

  let daError = false

  try {
    const response = await fetch(api_UsuariosYSuscripciones+'planes', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(planData),
    })

    if (!response.ok) {
      console.error('Failed to update plan:', response.statusText)
      throw new Error('Failed to update plan')
    }

    console.log('Plan updated successfully')
    revalidatePath('/suscriptions/edit/[id]')
  } catch (error) {
    daError = true
    console.error('Error updating plan:', error)
    //return { error: 'Failed to update plan. Please try again.' }
  }
  if (!daError) {
    redirect('/admin')
  } else {
    redirect('/error')
  }
}

export default async function EditSubscriptionPage({ params }: { params: { id: string } }) {
  console.log('Rendering EditSubscriptionPage with params:', params)
  const id = parseInt(params.id, 10)
  
  if (isNaN(id)) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Id invalido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white">La identificación proporcionada no es válida.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const plans = await getPlans()
  const plan = plans.find(p => p.id_plan === id)

  if (!plan) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Plan no encontrado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white">El plan pasado con la id: {id} no se ha podido encontrar.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Editar Plan</CardTitle>
          <CardDescription className="text-zinc-400">Actualiza los detalles de los planes.</CardDescription>
        </CardHeader>
        <form action={updatePlan.bind(null, id)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre_plan" className="text-white">Nombre del plan</Label>
              <Input
                id="nombre_plan"
                name="nombre_plan"
                defaultValue={plan.nombre_plan}
                required
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="precio" className="text-white">Precio</Label>
              <Input
                id="precio"
                name="precio"
                type="number"
                step="0.01"
                defaultValue={plan.precio}
                required
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-white">Descripción</Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                defaultValue={plan.descripcion}
                required
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
              Actualizar plan
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

