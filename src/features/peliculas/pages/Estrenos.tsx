import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EsqueletoGrilla } from '@/shared/components/EsqueletoGrilla'
import { MensajeError } from '@/shared/components/MensajeError'
import { Paginador } from '@/shared/components/Paginador'
import { MAX_PAGINAS } from '@/shared/models/pagina'
import { useFavoritas } from '@/core/favoritas/favoritas-context'
import { GrillaPeliculas } from '../components/GrillaPeliculas'
import { useEstrenos } from '../hooks/usePeliculas'
import type { PeliculaResumen } from '../models/pelicula'

interface Props {
  esFavorita?: (id: number) => boolean
  onFavorito?: (pelicula: PeliculaResumen) => void
}

const PAISES = [
  { codigo: 'todos', nombre: 'Todos los países' },
  { codigo: 'AR', nombre: 'Argentina' },
  { codigo: 'BR', nombre: 'Brasil' },
  { codigo: 'CA', nombre: 'Canadá' },
  { codigo: 'CL', nombre: 'Chile' },
  { codigo: 'CO', nombre: 'Colombia' },
  { codigo: 'DE', nombre: 'Alemania' },
  { codigo: 'ES', nombre: 'España' },
  { codigo: 'FR', nombre: 'Francia' },
  { codigo: 'GB', nombre: 'Reino Unido' },
  { codigo: 'IT', nombre: 'Italia' },
  { codigo: 'JP', nombre: 'Japón' },
  { codigo: 'KR', nombre: 'Corea del Sur' },
  { codigo: 'MX', nombre: 'México' },
  { codigo: 'PE', nombre: 'Perú' },
  { codigo: 'US', nombre: 'Estados Unidos' },
  { codigo: 'UY', nombre: 'Uruguay' },
  { codigo: 'VE', nombre: 'Venezuela' },
]

export function Estrenos({ esFavorita: esFavoritaProp, onFavorito: onFavoritoProp }: Props) {
  const contextoFavoritas = useFavoritas()
  const esFavorita = esFavoritaProp ?? contextoFavoritas.esFavorita
  const onFavorito = onFavoritoProp ?? contextoFavoritas.alternar

  const [pagina, setPagina] = useState(1)
  const [region, setRegion] = useState('todos')

  const { datos: respuesta, error, cargando, reintentar } = useEstrenos(pagina, region)

  function cambiarRegion(nuevaRegion: string) {
    setRegion(nuevaRegion)
    setPagina(1)
  }

  function cambiarPagina(nuevaPagina: number) {
    setPagina(nuevaPagina)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hoyStr = new Date().toISOString().slice(0, 10)
  const fechaHoyMs = new Date(`${hoyStr}T00:00:00`).getTime()

  const candidatos = (respuesta?.results ?? [])
    .filter((p) => p.release_date && p.release_date >= hoyStr)
    .sort((a, b) => a.release_date.localeCompare(b.release_date))

  const proximoEstreno = candidatos[0]

  let mensajeAviso: string | null = null
  if (proximoEstreno) {
    if (proximoEstreno.release_date === hoyStr) {
      mensajeAviso = `El próximo estreno es ${proximoEstreno.title} se estrena hoy`
    } else {
      const fechaEstrenoMs = new Date(`${proximoEstreno.release_date}T00:00:00`).getTime()
      const dias = Math.round((fechaEstrenoMs - fechaHoyMs) / (1000 * 60 * 60 * 24))
      mensajeAviso = `El próximo estreno es ${proximoEstreno.title} en ${dias} días`
    }
  }

  const totalPaginas = Math.min(respuesta?.total_pages ?? 0, MAX_PAGINAS)

  return (
    <section>
      <title>Próximos estrenos - Cartelera</title>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Próximos estrenos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Películas que llegarán pronto a los cines</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">País</span>
          <Select value={region} onValueChange={cambiarRegion}>
            <SelectTrigger className="w-56" aria-label="País">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAISES.map((p) => (
                <SelectItem key={p.codigo} value={p.codigo}>
                  {p.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {mensajeAviso && (
        <div className="mb-8 rounded-lg border bg-card p-4 text-card-foreground shadow-xs">
          <p className="text-sm font-medium">{mensajeAviso}</p>
        </div>
      )}

      {error ? (
        <MensajeError mensaje={error} onReintentar={reintentar} />
      ) : cargando && !respuesta ? (
        <EsqueletoGrilla />
      ) : (
        <div className={cargando ? 'opacity-50 transition-opacity' : 'transition-opacity'}>
          <GrillaPeliculas peliculas={respuesta?.results ?? []} esFavorita={esFavorita} onFavorito={onFavorito} />
          <Paginador pagina={pagina} totalPaginas={totalPaginas} onCambiar={cambiarPagina} />
        </div>
      )}
    </section>
  )
}
export default Estrenos
