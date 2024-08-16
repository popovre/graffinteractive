import styles from "./style.module.scss"
import { useState, useEffect } from "react"
import SlidesList from "../slides-list/component"
import Arrows from "../arrows/component"
import Dots from "../dots/component"
import { SliderContext } from "../../context/slider"
import Loader from "../loader/component"

const BASE_QUERY = "http://localhost:3001/api/slides"

const Slider = (width = "100%", height = "100%") => {
  const [items, setItems] = useState([])
  const [slide, setSlide] = useState(0)
  const [loading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const data = await fetch(`${BASE_QUERY}/${slide}`)
        const startSlide = await data.json()
        setItems([startSlide])
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const fetchSlide = async nextSlide => {
    setIsLoading(true)
    try {
      const response = await fetch(`${BASE_QUERY}/${nextSlide}`)
      return await response.json()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const changeSlide = async (direction = 1) => {
    let nextSlide = slide + direction

    if (nextSlide < 0) {
      nextSlide = items.length - 1
    } else if (nextSlide >= items.length) {
      const newSlide = await fetchSlide(nextSlide)
      newSlide?.lastIndex ? (nextSlide = 0) : setItems([...items, newSlide])
    } else {
      nextSlide = nextSlide % items.length
    }
    setSlide(nextSlide)
  }

  const goToSlide = number => {
    setSlide(number % items.length)
  }

  return (
    <div className={styles.root} style={{ width, height }}>
      <SliderContext.Provider
        value={{
          goToSlide,
          changeSlide,
          slidesCount: items.length,
          slideNumber: slide,
          loading,
          items,
        }}
      >
        {loading && <Loader />}
        <Arrows />
        <SlidesList />
        <Dots />
      </SliderContext.Provider>
    </div>
  )
}

export default Slider
