export type sessionType = {
    id_user: number
    nombre: string
    apellido: string
    id_perfil?: number
    apodo?: string
    imagen_avatar?: string
    role?: string
}

export type usuarioType = {
    id?: number
    nombre: string
    apellido: string
    email: string
    password?: string
    role?: string
}

export type perfilType = {
    id: number
    id_usuario: number
    apodo: string
    imagen_avatar: string
}

export type generoType =  {
    id_genero: number;
    nombre: string;
    descripcion: string;
}
export type contenidoDescType = {
    id_contenido: number;
    titulo: string;
    descripcion: string;
    fecha_lanzamiento: string;
    duracion: number;
    tipo: string;
    stream_url: string;
    portada_url: string;
    trailer_url: string;
    generos: generoType[];
}

export type episodioType = {
    id_contenido: number;
    id_episodio: number;
    num_temporada: number;
    num_episodio: number;
    titulo: string;
    descripcion: string;
    duracion: string;
    stream_url: string;
}
