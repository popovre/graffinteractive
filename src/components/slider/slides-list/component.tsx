import { SliderContext } from "../../../context/slider"
import Slide from "./slide/component"
import styles from "./style.module.scss"
import { useContext } from "react"

export default function SlidesList({ slides }) {
  const { slideIndex } = useContext(SliderContext)
  return (
    <div
      className={styles.root}
      style={{ transform: `translateX(-${slideIndex * 100}%)` }}
    >
      {slides.map((slide, index) => (
        <Slide key={index} slide={slide} />
      ))}
    </div>
  )
}
