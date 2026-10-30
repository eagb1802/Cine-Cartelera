import { tmdb } from '@/core/api/tmdb'
import type { Pagina } from '@/shared/models/pagina'
import type { DetallePelicula, Genero, Orden, Pelicula } from '../models/pelicula'

export interface FiltrosListado {
  pagina: number
  genero?: number
  orden?: Orden
}

export async function descubrir({ pagina, genero, orden = 'popularity.desc' }: FiltrosListado, signal?: AbortSignal) {
  const { data } = await tmdb.get<Pagina<Pelicula>>('/discover/movie', {
    params: {
      page: pagina,
      with_genres: genero,
      sort_by: orden,
      'vote_count.gte': orden === 'vote_average.desc' ? 300 : undefined,
      'primary_release_date.lte': orden === 'primary_release_date.desc' ? hoy() : undefined,
      include_adult: false,
    },
    signal,
  })
  return data
}

export async function buscar(texto: string, pagina: number, signal?: AbortSignal) {
  const { data } = await tmdb.get<Pagina<Pelicula>>('/search/movie', {
    params: { query: texto, page: pagina, include_adult: false },
    signal,
  })
  return data
}

export async function obtenerDetalle(id: number, signal?: AbortSignal) {
  const { data } = await tmdb.get<DetallePelicula>(`/movie/${id}`, {
    params: { append_to_response: 'credits,videos,similar', include_video_language: 'es,en' },
    signal,
  })
  return data
}

export async function obtenerGeneros(signal?: AbortSignal) {
  const { data } = await tmdb.get<{ genres: Genero[] }>('/genre/movie/list', { signal })
  return data.genres
}

export async function obtenerEstrenos(pagina = 1, region?: string, signal?: AbortSignal) {
  const { data } = await tmdb.get<Pagina<Pelicula>>('/movie/upcoming', {
    params: {
      page: pagina,
      region: region === 'todos' || !region ? undefined : region,
    },
    signal,
  })
  return data
}

function hoy() {
  return new Date().toISOString().slice(0, 10)
}
