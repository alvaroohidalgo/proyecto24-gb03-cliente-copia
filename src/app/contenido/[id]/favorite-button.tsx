import { revalidatePath } from 'next/cache'
import { Star } from 'lucide-react'
import { api_Personalizacion } from '@/lib/config'

interface FavoriteButtonProps {
  id_contenido: number
  id_perfil: number
  isFavorite: boolean
  favoriteId: number | null
}

async function toggleFavorite(id_contenido: number, id_perfil: number, currentStatus: boolean, favoriteId: number | null) {
  'use server'
  
  const fecha_agregado = new Date().toISOString()

  try {
    let url = api_Personalizacion+"favoritos"
    let method = 'POST'
    let body = { id_perfil, id_contenido, fecha_agregado }

    if (currentStatus && favoriteId) {
      url = api_Personalizacion+"favoritos/"+favoriteId
      method = 'DELETE'
      //body = {}
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Failed to ${currentStatus ? 'remove' : 'add'} favorite`)
    }

    // Revalidate the current path to reflect the changes
    revalidatePath('/contenido/[id]')
  } catch (error) {
    console.error('Error toggling favorite:', error)
  }
}

export default function FavoriteButton({ id_contenido, id_perfil, isFavorite, favoriteId }: FavoriteButtonProps) {
  const handleClick = toggleFavorite.bind(null, id_contenido, id_perfil, isFavorite, favoriteId)

  return (
    <form action={handleClick}>
      <button
        type="submit"
        className={`p-2 rounded-full ${
          isFavorite
            ? 'bg-yellow-500 text-white'
            : 'bg-gray-500/50 text-white hover:bg-gray-500/70'
        } transition-colors`}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Star className="w-6 h-6" fill={isFavorite ? "currentColor" : "none"} />
      </button>
    </form>
  )
}


