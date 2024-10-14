import { useEffect, useState } from "react"
import type { slide } from "./slides-list/slide/component"

export const useFetchData = (
  url: string,
  callback: (respData: slide) => void,
  slideIndex: number,
  refresh?: boolean,
) => {
  let controller = new AbortController()
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setError(null)
  }, [slideIndex])

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(respData => {
        setData(respData)
        callback(respData)
      })
      .catch(e => {
        console.error(e)
        setError(e)
      })
      .finally(() => {
        setIsLoading(false)
      })
    return () => {
      controller.abort()
    }
  }, [url, refresh])

  return [data, isLoading, error]
}
