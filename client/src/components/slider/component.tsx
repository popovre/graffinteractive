import { useCallback, useState } from "react"

import type { slide } from "./slides-list/slide/component"

import styles from "./style.module.scss"
import SlidesList from "./slides-list/component"
import Arrows from "./arrows/component"
import Dots from "./dots/component"
import { SliderContext } from "../../context/slider"
import Loader from "../loader/component"
import { useFetchData } from "./use-fetch-data"
import { BASE_HTTP_QUERY } from "../../constants"
import ErrorComponent from "./error-component/component"

export type slides = slide[]

const Slider = () => {
  const [slides, setSlides] = useState<slides>([])
  const [slideIndex, setSlideIndex] = useState(0)
  const [url, setUrl] = useState(`${BASE_HTTP_QUERY}/${slideIndex}`)
  const [refresh, setRefresh] = useState(false)

  const isDuplicatedSlide = (fetchdedData: slide): boolean =>
    slides.find((slide: slide) => slide.id === fetchdedData.id) !== undefined

  const handleData = (fetchedData: slide): void => {
    if (!isDuplicatedSlide(fetchedData)) {
      setSlides([...slides, fetchedData])
      setSlideIndex(slides.length)
    }
  }

  const [, initLoading, error] = useFetchData(
    url,
    handleData,
    slideIndex,
    refresh,
  )

  const fetchSlide = (nextSlide: number) => {
    setUrl(`${BASE_HTTP_QUERY}/${nextSlide}`)
    setRefresh(!refresh)
  }

  const changeSlide = useCallback(
    (direction = 1) => {
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
    },
    [slideIndex, slides],
  )

  const handleError = () => {
    if (slideIndex !== 0 && slides[0]) {
      setSlideIndex(0)
      return
    }
    setRefresh(!refresh)
  }

  const goToSlide = useCallback(
    (index: number) => {
      setSlideIndex(index % slides.length)
    },
    [slides],
  )

  return (
    <div className={styles.root}>
      <SliderContext.Provider
        value={{
          goToSlide,
          slideIndex,
        }}
      >
        {initLoading && <Loader />}
        {error && <ErrorComponent onClick={handleError} />}
        <Arrows changeSlide={changeSlide} />
        <SlidesList slides={slides} />
        <Dots slides={slides} slideIndex={slideIndex} />
      </SliderContext.Provider>
    </div>
  )
}

export default Slider
