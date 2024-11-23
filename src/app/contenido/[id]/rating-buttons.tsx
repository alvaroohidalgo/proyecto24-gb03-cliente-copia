import { revalidatePath } from 'next/cache'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { api_Personalizacion } from '@/lib/config'

interface RatingButtonsProps {
  id_contenido: number
  id_perfil: number
  initialRating: { id_rating: number | null, thumb_up: boolean | null } | null
}

async function getRating(id_contenido: number, id_perfil: number) {
  try {
    const response = await fetch(api_Personalizacion+"ratings/content/"+id_contenido);
    if (!response.ok) {
      throw new Error('Failed to fetch ratings');
    }
    const ratings = await response.json();
    const userRating = ratings.find((rating: any) => rating.id_perfil === id_perfil);
    return userRating ? { id_rating: userRating.id_rating, thumb_up: userRating.thumb_up } : null;
  } catch (error) {
    console.error('Error fetching rating:', error);
    return null;
  }
}

async function handleRating(id_contenido: number, id_perfil: number, thumb_up: boolean, currentRating: { id_rating: number | null, thumb_up: boolean | null } | null) {
  'use server'

  try {
    let url = api_Personalizacion+"ratings";
    let method = 'POST';
    let body = { id_contenido, id_perfil, thumb_up };

    if (currentRating && currentRating.id_rating) {
      if (currentRating.thumb_up === thumb_up) {
        // Delete rating if clicking the same button
        url = api_Personalizacion+"ratings/"+currentRating.id_rating;
        method = 'DELETE';
        //body = {};
      } else {
        // Update rating if changing from like to dislike or vice versa
        url = api_Personalizacion+"ratings/"+currentRating.id_rating;
        method = 'PUT';
      }
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to update rating');
    }

    revalidatePath('/contenido/[id]');
  } catch (error) {
    console.error('Error updating rating:', error);
  }
}

export default function RatingButtons({ id_contenido, id_perfil, initialRating }: RatingButtonsProps) {
  const handleLike = handleRating.bind(null, id_contenido, id_perfil, true, initialRating);
  const handleDislike = handleRating.bind(null, id_contenido, id_perfil, false, initialRating);

  return (
    <div className="flex space-x-2">
      <form action={handleLike}>
        <button
          type="submit"
          className={`p-2 rounded-full ${
            initialRating && initialRating.thumb_up === true
              ? 'bg-green-500 text-white'
              : 'bg-gray-500/50 text-white hover:bg-gray-500/70'
          } transition-colors`}
          aria-label="Like"
        >
          <ThumbsUp className="w-6 h-6" />
        </button>
      </form>
      <form action={handleDislike}>
        <button
          type="submit"
          className={`p-2 rounded-full ${
            initialRating && initialRating.thumb_up === false
              ? 'bg-red-500 text-white'
              : 'bg-gray-500/50 text-white hover:bg-gray-500/70'
          } transition-colors`}
          aria-label="Dislike"
        >
          <ThumbsDown className="w-6 h-6" />
        </button>
      </form>
    </div>
  )
}