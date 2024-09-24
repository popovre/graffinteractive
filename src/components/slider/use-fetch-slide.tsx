import { useEffect, useState } from "react"

export const useFetchData = url => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setData(null)
    setError(null)
    setIsLoading(true)
    fetch(url)
      .then(res => res.json())
      .then(respData => setData(respData))
      .catch(err => setError(err))
      .finally(() => setIsLoading(false))
  }, [url])

  return [data, isLoading, error]
}
