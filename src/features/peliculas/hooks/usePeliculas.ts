import { useConsulta } from '@/shared/hooks/useConsulta'
import { obtenerDetalle, obtenerEstrenos } from '../services/peliculas.service'

export function useEstrenos(pagina: number, region?: string) {
  return useConsulta((signal) => obtenerEstrenos(pagina, region, signal), [pagina, region])
}

export function usePelicula(id: number) {
  return useConsulta((signal) => obtenerDetalle(id, signal), [id])
}
