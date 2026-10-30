import { createBrowserRouter, Navigate } from 'react-router'
import App from '@/App'
import { CatalogoPeliculas } from '@/features/peliculas/pages/CatalogoPeliculas'
import { MisFavoritas } from '@/features/favoritas/pages/MisFavoritas'
import { NoEncontrada } from '@/core/layout/NoEncontrada'
import { Estrenos } from '@/features/peliculas/pages/Estrenos'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/peliculas" replace />,
      },
      {
        path: 'peliculas',
        element: <CatalogoPeliculas esFavorita={() => false} onFavorito={() => {}} />,
      },
      {
        path: 'estrenos',
        element: <Estrenos />,
      },
      {
        path: 'favoritas',
        element: <MisFavoritas favoritas={[]} onFavorito={() => {}} onIrAlCatalogo={() => {}} />,
      },
      {
        path: '*',
        element: <NoEncontrada />,
      },
    ],
  },
])
