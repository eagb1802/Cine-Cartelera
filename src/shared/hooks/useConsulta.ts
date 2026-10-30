import { useEffect, useState } from 'react'
import axios from 'axios'

export function useConsulta<T>(
  consultar: (signal: AbortSignal) => Promise<T>,
  dependencias: unknown[] = [],
) {
  const [datos, setDatos] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    const control = new AbortController()

    async function ejecutar() {
      setCargando(true)
      setError(null)
      try {
        const respuesta = await consultar(control.signal)
        setDatos(respuesta)
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

    ejecutar()

    return () => control.abort()
  }, [...dependencias, intento])

  const reintentar = () => setIntento((i) => i + 1)

  return { datos, error, cargando, reintentar }
}
