import styles from "./style.module.scss"
import { useState, useEffect } from "react"
import SlidesList from "./slides-list/component"
import Arrows from "./arrows/component"
import Dots from "./dots/component"
import { SliderContext } from "../../context/slider"
import Loader from "../loader/component"
import { useFetchData } from "./use-fetch-data"
//TODO: я понял что рендерить промис можно, достаточно передать ему в аргумент колэк и внутри колбека записывать данные в стэйт значение resolve

const Slider = () => {
  //TODO: как вынести все константы в отдельный файл и собирать его в проект? Заметки от Максима
  const BASE_QUERY = "http://localhost:3001/api/slides"
  const [slides, setSlides] = useState([])
  const [slideIndex, setSlideIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [url, setUrl] = useState(`${BASE_QUERY}/${slideIndex}`)

  const [data, initLoading, error] = useFetchData(url, fetchedData => {
    //TODO: вынести в отдельную функцию, допилить запрос последнего слайда
    fetchedData.lastIndex
      ? setSlideIndex(0)
      : setSlides([...slides, fetchedData])
  })

  const fetchSlide = async nextSlide => {
    setUrl(`${BASE_QUERY}/${nextSlide}`)
  }

  const changeSlide = async (direction = 1) => {
    let nextSlide = slideIndex + direction

    if (nextSlide < 0) {
      nextSlide = slides.length - 1
    } else if (nextSlide >= slides.length) {
      fetchSlide(nextSlide)
    } else {
      nextSlide = nextSlide % slides.length
    }
    setSlideIndex(nextSlide)
  }

  const goToSlide = number => {
    setSlideIndex(number % slides.length)
  }

  return (
    <div className={styles.root}>
      <SliderContext.Provider
        value={{
          goToSlide,
          changeSlide,
          slidesCount: slides.length,
          slideNumber: slideIndex,
          loading: isLoading,
          items: slides,
        }}
      >
        {(isLoading || initLoading) && <Loader />}
        <Arrows />
        <SlidesList />
        <Dots />
      </SliderContext.Provider>
    </div>
  )
}

export default Slider
