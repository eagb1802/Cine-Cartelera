import { useConsulta } from '@/shared/hooks/useConsulta'
import { obtenerEstrenos } from '../services/peliculas.service'

export function useEstrenos(pagina: number, region?: string) {
  return useConsulta((signal) => obtenerEstrenos(pagina, region, signal), [pagina, region])
}
