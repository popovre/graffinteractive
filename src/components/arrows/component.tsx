import { useContext } from "react"
import { SliderContext } from "../../context/slider"
import styles from "./style.module.scss"

export default function Arrows() {
  const { changeSlide } = useContext(SliderContext)

  return (
    <div className={styles.root}>
      <div
        className={(styles.left, styles.arrow)}
        onClick={() => {
          changeSlide(-1)
        }}
      >
        Лево
      </div>
      <div
        className={(styles.right, styles.arrow)}
        onClick={() => {
          changeSlide(1)
        }}
      >
        Право
      </div>
    </div>
  )
}
