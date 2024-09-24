import styles from "./style.module.scss"
import { useState, useEffect } from "react"
import SlidesList from "./slides-list/component"
import Arrows from "./arrows/component"
import Dots from "./dots/component"
import { SliderContext } from "../../context/slider"
import Loader from "../loader/component"
import { useFetchData } from "./use-fetch-slide"

//TODO: как вынести все константы в отдельный файл и собирать его в проект? Заметки от Максима
const BASE_QUERY = "http://localhost:3001/api/slides"

const Slider = () => {
  const [items, setItems] = useState([])
  const [slide, setSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const [initialSlide, loading, error] = useFetchData(`${BASE_QUERY}/${slide}`)

  // useEffect(() => {
  //   console.log("slider effect")
  //   const loadData = async () => {
  //     setIsLoading(true)
  //     try {
  //       const data = await fetch(`${BASE_QUERY}/${slide}`)
  //       const startSlide = await data.json()
  //       setItems([startSlide])
  //     } catch (error) {
  //       console.log(error)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }
  //   loadData()
  // }, [])

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
    <div className={styles.root}>
      <SliderContext.Provider
        value={{
          goToSlide,
          changeSlide,
          slidesCount: items.length,
          slideNumber: slide,
          loading: isLoading,
          items,
        }}
      >
        {isLoading && <Loader />}
        <Arrows />
        <SlidesList />
        <Dots />
      </SliderContext.Provider>
    </div>
  )
}

export default Slider
