'use server';
import { api_Personalizacion } from "@/lib/config";
import axios from "axios";

export const enviarReproduccion = async (id_perfil: number, id_contenido: number) => {
  

    try {
      
        const historialUrl = (api_Personalizacion+"historial/perfil/"+id_perfil);
        const respuesta = await axios.get(historialUrl);
        
      
        const existeVisualizacion = respuesta.data.find((item: any) => item.id_contenido === id_contenido);

        if (existeVisualizacion) {
            const id_visualizacion = existeVisualizacion.id_visualizacion;
           
            if (!id_visualizacion) {
                throw new Error("no existe id_visulaizacion");
            }
           
            await axios.put(api_Personalizacion + "historial/" + id_visualizacion, { 
                id_perfil: id_perfil, 
                id_contenido: id_contenido, 
                fecha_visualizacion: new Date().toISOString(), 
                progreso: 0
            });
        } else {
         
            await axios.post(api_Personalizacion + "historial", { 
                id_perfil: id_perfil, 
                id_contenido: id_contenido, 
                fecha_visualizacion: new Date().toISOString(), 
                progreso: 0 } 
            );
        }
    } catch (error) {
        console.error("Error enviando o actualizando historial:", error);
    }
}

