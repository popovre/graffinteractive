import { useContext } from "react"
import { SliderContext } from "../../../context/slider"
import styles from "./style.module.scss"
import Arrow from "../../../assets/icons/arrow.svg?react"

export default function Arrows() {
  const { changeSlide } = useContext(SliderContext)

  return (
    <div className={styles.root}>
      <div
        className={styles.iconWrapper}
        onClick={() => {
          changeSlide(-1)
        }}
      >
        <Arrow className={(styles.arrow, styles.arrowLeft)} />
      </div>
      <div
        className={styles.iconWrapper}
        onClick={() => {
          changeSlide(1)
        }}
      >
        <Arrow className={(styles.arrow, styles.arrowRight)} />
      </div>
    </div>
  )
}
