import { useState } from "react"
import { memo } from "react"

import styles from "./style.module.scss"
import SlidesList from "./slides-list/component"
import Arrows from "./arrows/component"
import Dots from "./dots/component"
import { SliderContext } from "../../context/slider"
import Loader from "../loader/component"
import { useFetchData } from "./use-fetch-data"

const Slider = () => {
  //TODO: как вынести все константы в отдельный файл и собирать его в проект? Заметки от Максима
  const BASE_QUERY = "http://localhost:3001/api/slides"
  const [slides, setSlides] = useState([])
  const [slideIndex, setSlideIndex] = useState(0)
  const [url, setUrl] = useState(`${BASE_QUERY}/${slideIndex}`)

  console.log("slider render")

  const isDuplicatedSlide = fetchdedData =>
    slides.find(slide => slide.id === fetchdedData.id) !== undefined

  const handleData = fetchedData => {
    if (!isDuplicatedSlide(fetchedData)) {
      setSlides([...slides, fetchedData])
      setSlideIndex(slides.length)
    }
  }

  const [data, initLoading, error] = useFetchData(url, handleData)

  const fetchSlide = nextSlide => {
    setUrl(`${BASE_QUERY}/${nextSlide}`)
  }

  const changeSlide = async (direction = 1) => {
    let nextSlide = slideIndex + direction

    if (nextSlide < 0) {
      nextSlide = slides.length - 1
      setSlideIndex(nextSlide)
      return
    } else if (nextSlide === slides.length) {
      slides[slideIndex]?.lastIndex ? setSlideIndex(0) : fetchSlide(nextSlide)
      return
    }
    nextSlide = nextSlide % slides.length
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
          slideIndex,
          loading: initLoading,
        }}
      >
        {initLoading && <Loader />}
        <Arrows />
        <SlidesList slides={slides} />
        <Dots slides={slides} />
      </SliderContext.Provider>
    </div>
  )
}

export default Slider
