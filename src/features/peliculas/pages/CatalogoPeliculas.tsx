import { useEffect, useState } from 'react'
import { FiltrosPeliculas } from '../components/FiltrosPeliculas'
import { GrillaPeliculas } from '../components/GrillaPeliculas'
import { type Genero, type Orden, type Pelicula, type PeliculaResumen } from '../models/pelicula'
import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { SearchX } from 'lucide-react'
import { MAX_PAGINAS, type Pagina } from '@/shared/models/pagina'
import { buscar, descubrir, obtenerGeneros } from '../services/peliculas.service'
import { MensajeError } from '@/shared/components/MensajeError'
import { EsqueletoGrilla } from '@/shared/components/EsqueletoGrilla'
import axios from 'axios'
import { Paginador } from '@/shared/components/Paginador'
import { useFavoritas } from '@/core/favoritas/favoritas-context'

interface Props {
  esFavorita?: (id: number) => boolean
  onFavorito?: (pelicula: PeliculaResumen) => void
}

export function CatalogoPeliculas({ esFavorita: esFavoritaProp, onFavorito: onFavoritoProp }: Props) {
  const contextoFavoritas = useFavoritas()
  const esFavorita = esFavoritaProp ?? contextoFavoritas.esFavorita
  const onFavorito = onFavoritoProp ?? contextoFavoritas.alternar

  const [busqueda, setBusqueda] = useState('')
  const [genero, setGenero] = useState<number>()
  const [orden, setOrden] = useState<Orden>('popularity.desc')
  const [pagina, setPagina] = useState(1)

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [respuesta, setRespuesta] = useState<Pagina<Pelicula> | null>(null)
  const [intento, setIntento] = useState(0)
  const [generos, setGeneros] = useState<Genero[]>([])

  const formato = new Intl.NumberFormat('es-VE')

  useEffect(() => {
    const control = new AbortController()

    async function cargar() {
      setCargando(true)
      setError(null)
      try {
        const datos = busqueda
          ? await buscar(busqueda, pagina, control.signal)
          : await descubrir({ pagina, genero, orden }, control.signal)
        setRespuesta(datos)
      } catch (e) {
        if (!axios.isCancel(e)) {
          setError((e as Error).message)
        }
      } finally {
        if (!control.signal.aborted) {
          setCargando(false)
        }
      }
    }

    cargar()

    return () => control.abort()
  }, [busqueda, genero, orden, pagina, intento])

  useEffect(() => {
    const control = new AbortController()
    obtenerGeneros(control.signal)
      .then(setGeneros)
      .catch(() => {})

    return () => control.abort()
  }, [])

  function cambiarBusqueda(texto: string) {
    setBusqueda(texto)
    setPagina(1)
  }

  function cambiarGenero(nuevoGenero: number | undefined) {
    setGenero(nuevoGenero)
    setPagina(1)
  }

  function cambiarOrden(nuevoOrden: Orden) {
    setOrden(nuevoOrden)
    setPagina(1)
  }

  function irAPaginaNueva(nueva: number) {
    setPagina(nueva)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const totalPaginas = Math.min(respuesta?.total_pages ?? 0, MAX_PAGINAS)

  return (
    <section>
      <title>Catálogo de películas · Cartelera</title>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Películas</h1>
        {respuesta && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {formato.format(respuesta.total_results)} resultados
          </span>
        )}
      </div>

      <FiltrosPeliculas
        busqueda={busqueda}
        genero={genero}
        orden={orden}
        generos={generos}
        onBuscar={cambiarBusqueda}
        onGenero={cambiarGenero}
        onOrden={cambiarOrden}
      />

      {error ? (
        <MensajeError mensaje={error} onReintentar={() => setIntento((i) => i + 1)} />
      ) : !respuesta ? (
        <EsqueletoGrilla />
      ) : respuesta.results.length === 0 ? (
        <EstadoVacio icono={SearchX} titulo="Sin resultados">
          <p>No hay películas que coincidan con &quot;{busqueda}&quot;</p>
        </EstadoVacio>
      ) : (
        <div className={cargando ? 'opacity-50 transition-opacity' : 'transition-opacity'}>
          <GrillaPeliculas peliculas={respuesta.results} esFavorita={esFavorita} onFavorito={onFavorito} />
          <Paginador pagina={pagina} totalPaginas={totalPaginas} onCambiar={irAPaginaNueva} />
        </div>
      )}
    </section>
  )
}
