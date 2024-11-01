import { useEffect, useState } from "react"
import type { slide } from "./slides-list/slide/component"

export const useFetchData = (
  url: string,
  callback: (respData: slide) => void,
  slideIndex: number,
  refresh?: boolean,
) => {
  // let controller = new AbortController()
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setError(null)
  }, [slideIndex])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)
    fetch(
      url,
      // TODO: выяснить почему при строгом режиме происходит аборт запроса при первоначальной загрузке
      //  { signal: controller.signal }
    )
      .then(res => res.json())
      .then(respData => {
        if (!cancelled) {
          setData(respData)
          callback(respData)
        }
      })
      .catch(e => {
        if (!cancelled) {
          console.error(e)
          setError(e)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })
    return () => {
      // controller.abort()
      cancelled = true
    }
  }, [url, refresh])

  return [data, isLoading, error]
}
