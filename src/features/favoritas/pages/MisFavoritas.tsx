import { Heart } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { GrillaPeliculas } from '@/features/peliculas/components/GrillaPeliculas'
import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { useFavoritas } from '@/core/favoritas/favoritas-context'

export function MisFavoritas() {
  const { favoritas, alternar, esFavorita } = useFavoritas()

  return (
    <section>
      <title>Mis favoritas · Cartelera</title>
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Mis favoritas</h1>

      {favoritas.length === 0 ? (
        <EstadoVacio icono={Heart} titulo="Todavía no marcas ninguna película">
          <Button variant="outline" asChild>
            <Link to="/peliculas">Ir al catálogo</Link>
          </Button>
        </EstadoVacio>
      ) : (
        <GrillaPeliculas peliculas={favoritas} esFavorita={esFavorita} onFavorito={alternar} />
      )}
    </section>
  )
}
export default MisFavoritas
