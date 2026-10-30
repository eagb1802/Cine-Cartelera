import { createContext, use } from 'react'
import type { PeliculaResumen } from '../features/peliculas/models/pelicula'

export interface FavoritasValor {
  favoritas: PeliculaResumen[]
  esFavorita: (id: number) => boolean
  alternar: (pelicula: PeliculaResumen) => void
}

export const FavoritasContext = createContext<FavoritasValor | null>(null)

export function useFavoritas() {
  const contexto = use(FavoritasContext)
  if (!contexto) {
    throw new Error('useFavoritas debe usarse dentro de un FavoritasProvider')
  }
  return contexto
}
