import styles from "./style.module.scss"
import Arrow from "../../../assets/icons/arrow.svg?react"
import { memo } from "react"

const Arrows = memo(function Arrows({ changeSlide }) {
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
})

export default Arrows
