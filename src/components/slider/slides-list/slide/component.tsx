import { memo } from "react"
import styles from "./style.module.scss"

const Slide = memo(function Slide({ slide }) {
  console.log("slide render")
  return (
    <div className={styles.root}>
      <img src={slide?.src} alt={slide?.alt} className={styles.slideImage} />
    </div>
  )
})

export default Slide
