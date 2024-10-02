import { useEffect, useState } from "react"

export const useFetchData = (url, callback) => {
  let controller = new AbortController()
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

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
        setError(e)
      })
      .finally(() => {
        setIsLoading(false)
      })
    return () => {
      controller.abort()
    }
  }, [url])

  return [data, isLoading, error]
}