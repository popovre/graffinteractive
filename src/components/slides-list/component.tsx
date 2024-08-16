import { useContext } from "react"
import Slide from "../slide/component"
import { SliderContext } from "../../context/slider"
import styles from "./style.module.scss"

export default function SlidesList() {
  const { slideNumber, items } = useContext(SliderContext)

  return (
    <div
      className={styles.root}
      style={{ transform: `translateX(-${slideNumber * 100}%)` }}
    >
      {items.map((slide, index) => (
        <Slide key={index} slide={slide} />
      ))}
    </div>
  )
}
