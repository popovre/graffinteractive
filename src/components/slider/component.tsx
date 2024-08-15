import styles from "./style.module.scss"
import img1 from "../../assets/images/unsplash_7AcMUSYRZpU.png"
import img2 from "../../assets/images/unsplash_DpphPG9ENsI.png"
import img3 from "../../assets/images/unsplash_Cx949d6dIFI.png"
import img4 from "../../assets/images/unsplash_NoRsyXmHGpI.png"
import img5 from "../../assets/images/unsplash_W5XTTLpk1-I.png"
import img6 from "../../assets/images/unsplash_dC-z4r8tr6U.png"
import img7 from "../../assets/images/unsplash_mpw37yXc_WQ.png"
import { useState, useEffect } from "react"
import SlidesList from "../slides-list/component"
import Arrows from "../arrows/component"
import Dots from "../dots/component"
import { SliderContext } from "../../context/slider"

// const images = [img1, img2, img3, img4, img5, img6, img7]

// const getImages = async (time = 1000) => {
//   let promise = new Promise((res, rej) => {
//     setTimeout(() => {
//       res(images)
//     }, time)
//   })

//   return promise
// }

const Slider = (width = "100%", height = "100%") => {
  const [items, setItems] = useState([])
  const [slide, setSlide] = useState(0)
  const [touchPosition, setTouchPosition] = useState(null)
  const [loading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const data = await fetch(`http://localhost:3001/api/slides`)
      const slides = await data.json()
      console.log(slides, "slides")
      setItems([...slides])
    }
    loadData()
  }, [])

  const fetchSlide = async slide => {
    setIsLoading(true)
    const slideNumber = slide
    try {
      const response = await fetch(`http://localhost:3001/api/${slideNumber}`)
      const newImage = response.json()
      setItems([...images, newImage])
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const changeSlide = async (direction = 1) => {
    let nextSlideNumber = slide + direction

    if (nextSlideNumber < 0) {
      nextSlideNumber = items.length - 1
    }
    // else if (nextSlideNumber >= items.length) {
    //   await fetchSlide(nextSlideNumber)
    //   setSlide(nextSlideNumber)
    // }
    else {
      nextSlideNumber = nextSlideNumber % items.length
    }
    setSlide(nextSlideNumber)
  }

  const goToSlide = number => {
    setSlide(number % items.length)
  }

  const handleTouchStart = evt => {
    const touchDown = evt.touches[0].clientX
    setTouchPosition(touchDown)
  }

  const handleTouchMove = evt => {
    if (touchPosition === null) {
      return
    }

    const currentPosition = evt.touches[0].clientX
    const direction = touchPosition - currentPosition

    if (direction > items.length) {
      changeSlide(1)
    }

    if (direction < -items.length) {
      changeSlide(-1)
    }

    setTouchPosition(null)
  }

  return (
    <div
      className={styles.root}
      style={{ width, height }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <SliderContext.Provider
        value={{
          goToSlide,
          changeSlide,
          slidesCount: items.length,
          slideNumber: slide,
          items,
        }}
      >
        <Arrows />
        <SlidesList />
        <Dots />
      </SliderContext.Provider>
    </div>
  )
}

export default Slider
