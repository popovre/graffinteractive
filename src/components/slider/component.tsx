import styles from "./style.module.scss"
import img1 from "../../assets/images/unsplash_7AcMUSYRZpU.png"
import img2 from "../../assets/images/unsplash_DpphPG9ENsI.png"
import img3 from "../../assets/images/unsplash_Cx949d6dIFI.png"
import img4 from "../../assets/images/unsplash_NoRsyXmHGpI.png"
import img5 from "../../assets/images/unsplash_W5XTTLpk1-I.png"
import img6 from "../../assets/images/unsplash_dC-z4r8tr6U.png"
import img7 from "../../assets/images/unsplash_mpw37yXc_WQ.png"
import { useState, useEffect, createContext } from "react"

const images = [img1, img2, img3, img4, img5, img6, img7]

export const SliderContext = createContext()

const getImages = async (time = 1000) => {
  let promise = new Promise((res, rej) => {
    setTimeout(() => {
      res(images)
    }, time)
  })

  return promise
}

const Slider = (
  autoPlay = false,
  autoPlayTime = 5000,
  width = "100%",
  height = "100%",
) => {
  const [items, setItems] = useState([])
  const [slide, setSlide] = useState(0)
  const [touchPosition, setTouchPosition] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      const images = await getImages()
      setItems(images)
    }
    loadData()
  }, [])

  const changeSlide = (direction = 1) => {
    let slideNumber = 0

    if (slide + direction < 0) {
      slideNumber = items.length - 1
    } else {
      slideNumber = (slide + direction) % items.length
    }

    setSlide(slideNumber)
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

    if (direction > 10) {
      changeSlide(1)
    }

    if (direction < -10) {
      changeSlide(-1)
    }

    setTouchPosition(null)
  }

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      changeSlide(1)
    }, autoPlayTime)

    return () => {
      clearInterval(interval)
    }
  }, [items.length, slide])

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
        <button type="button">swipe left</button>
        <div>
          {items &&
            items.map(image => (
              <img
                className={styles.visibleImage}
                alt="flower"
                src={image}
              ></img>
            ))}
        </div>
        <button type="button">swipe right</button>
      </SliderContext.Provider>
    </div>
  )
}

export default Slider
