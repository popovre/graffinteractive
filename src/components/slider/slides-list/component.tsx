import { SliderContext } from "../../../context/slider"
import Slide from "./slide/component"
import styles from "./style.module.scss"
import { memo, useContext } from "react"

const SlidesList = memo(function SlidesList({ slides }) {
  const { slideIndex } = useContext(SliderContext)
  return (
    <div
      className={styles.root}
      style={{ transform: `translateX(-${slideIndex * 100}%)` }}
    >
      {slides.map((slide, index) => (
        <Slide key={`key-${slide.id}`} slide={slide} />
      ))}
    </div>
  )
})

export default SlidesList
