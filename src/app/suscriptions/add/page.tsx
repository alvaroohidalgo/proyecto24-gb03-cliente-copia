import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { api_UsuariosYSuscripciones } from '@/lib/config'

interface PlanFormData {
  nombre_plan: string
  precio: number
  descripcion: string
}

async function addPlan(formData: FormData) {
  'use server'

  const rawFormData = Object.fromEntries(formData.entries())
  const planData: PlanFormData = {
    nombre_plan: rawFormData.nombre_plan as string,
    precio: parseFloat(rawFormData.precio as string),
    descripcion: rawFormData.descripcion as string,
  }

  let daError = false

  try {
    const response = await fetch(api_UsuariosYSuscripciones+'planes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(planData),
    })

    if (!response.ok) {
      throw new Error('Failed to add plan')
    }

    revalidatePath('/suscriptions/add')
  } catch (error) {
    console.error('Error adding plan:', error)
    daError = true
  }
  if (!daError) {
    redirect('/admin')
  }else
    redirect('/error')
}

export default function SubscriptionPlanForm() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Añadir Plan</CardTitle>
          <CardDescription className="text-zinc-400">Crea un nuevo plan.</CardDescription>
        </CardHeader>
        <form action={addPlan}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre_plan" className="text-white">Nombre del plan</Label>
              <Input
                id="nombre_plan"
                name="nombre_plan"
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
                required
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-white">Descripción</Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                required
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
              Añadir plan
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}


