'use server'

import { SearchResult } from "@/components/Buscador"
import { api_Contenido } from "@/lib/config"
import { contenidoDescType } from "@/lib/types"
import axios from "axios"

// This is a mock function to simulate an API call
export const mockSearch = async (query: string) => {
    'use server'
    let contenidos : contenidoDescType[]= []
    try {
        const response = await axios.get(api_Contenido + 'contenidos/filtrar?' +
            'titulo=' + query
            )
        contenidos = response.data
        console.log(contenidos)
    } catch (error) {
        console.error(error)
    }
    // Mock results
    const resultados:SearchResult[] = contenidos.map((contenido) => ({
        id_contenido: contenido.id_contenido,
        titulo: contenido.titulo,
        href: 'contenido/' + contenido.id_contenido
    }))

    const resultados_max = resultados.slice(0, 5)
    return resultados_max
}
