'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Link } from 'lucide-react'

export interface IfaceMovie {
  id_contenido: number
  titulo: string
  portada_url: string
}

interface MovieCarouselProps {
  movies: IfaceMovie[]
}

export function MovieCarousel({ movies }: MovieCarouselProps) {
  const [startIndex, setStartIndex] = useState(0)

  const nextSlide = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % movies.length)
  }

  const prevSlide = () => {
    setStartIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length)
  }

  return (
    <div className="relative">
      <div className="flex overflow-hidden p-10">
        {movies.slice(startIndex, startIndex + 6).map((movie) => (
          <div key={movie.id_contenido} className="flex w-1/6 px-1  h-fit">
            <a href={`/contenido/${movie.id_contenido}`}>
              <div className="relative group">
                <img
                  src={movie.portada_url || '/images/Logo-Netflix.png'}
                  alt={movie.titulo}
                  className="rounded transition-transform duration-300 group-hover:scale-105 object-cover w-[250px] h-[120px]"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:scale-105 group-hover:bg-opacity-50 transition duration-300 flex items-center justify-center opacity-100 group-hover:opacity-100  object-cover w-full ">
                 
                </div>
                <p className="text-white text-center font-bold mt-2 group-hover:scale-105 transition duration-300">{movie.titulo}</p>
              </div>
            </a>
          </div>
        ))}
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        aria-label="Previous movies"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        aria-label="Next movies"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  )
}