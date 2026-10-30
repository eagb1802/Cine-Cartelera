import { Link, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MensajeError } from '@/shared/components/MensajeError'
import { useFavoritas } from '@/core/favoritas/favoritas-context'
import { EsqueletoFicha, FichaPelicula } from '../components/FichaPelicula'
import { usePelicula } from '../hooks/usePeliculas'

export function DetallePelicula() {
  const { id } = useParams<{ id: string }>()
  const idPelicula = Number(id)

  const { datos: pelicula, error, cargando, reintentar } = usePelicula(idPelicula)
  const { esFavorita, alternar } = useFavoritas()

  return (
    <section>
      {pelicula && <title>{`${pelicula.title} · Cartelera`}</title>}

      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/peliculas">
            <ArrowLeft className="size-4" /> Volver al catálogo
          </Link>
        </Button>
      </div>

      {error ? (
        <MensajeError mensaje={error} onReintentar={reintentar} />
      ) : cargando || !pelicula ? (
        <EsqueletoFicha />
      ) : (
        <FichaPelicula
          pelicula={pelicula}
          favorita={esFavorita(pelicula.id)}
          onFavorito={() =>
            alternar({
              id: pelicula.id,
              title: pelicula.title,
              poster_path: pelicula.poster_path,
              release_date: pelicula.release_date,
              vote_average: pelicula.vote_average,
            })
          }
        />
      )}
    </section>
  )
}
export default DetallePelicula

