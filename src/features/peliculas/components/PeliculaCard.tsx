import { Film } from 'lucide-react'
import { Link } from 'react-router'
import { imagen } from '@/core/config/tmdb'
import { anio, type PeliculaResumen } from '../models/pelicula'
import { BotonFavorito } from './BotonFavorito'
import { Calificacion } from './Calificacion'

interface Props {
  pelicula: PeliculaResumen
  favorita: boolean
  onFavorito: (pelicula: PeliculaResumen) => void
}

export function PeliculaCard({ pelicula, favorita, onFavorito }: Props) {
  const poster = imagen(pelicula.poster_path)

  return (
    <article className="group relative">
      <Link to={`/peliculas/${pelicula.id}`} className="block focus:outline-none">
        <div className="aspect-2/3 overflow-hidden rounded-xl bg-card ring-1 ring-border transition group-hover:ring-primary/60">
          {poster ? (
            <img
              src={poster}
              alt={`Póster de ${pelicula.title}`}
              loading="lazy"
              className="size-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="grid size-full place-items-center text-muted-foreground">
              <Film className="size-12" />
            </div>
          )}
        </div>
        <h3 className="mt-3 line-clamp-1 font-semibold group-hover:text-primary transition-colors" title={pelicula.title}>
          {pelicula.title}
        </h3>
        <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
          <span>{anio(pelicula.release_date)}</span>
          {pelicula.vote_average > 0 && <Calificacion valor={pelicula.vote_average} />}
        </div>
      </Link>

      <BotonFavorito activo={favorita} onAlternar={() => onFavorito(pelicula)} className="absolute top-2 right-2" />
    </article>
  )
}
