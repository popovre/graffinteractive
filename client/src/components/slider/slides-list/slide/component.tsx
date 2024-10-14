import { memo } from "react"
import styles from "./style.module.scss"

export interface slide {
  alt: string
  id: number
  lastIndex: boolean
  src: string
  title: string
}

export interface SlideProps {
  slide: slide
}

const Slide: React.FC<SlideProps> = memo(function Slide({ slide }) {
  return (
    <div className={styles.root}>
      <img src={slide?.src} alt={slide?.alt} className={styles.slideImage} />
    </div>
  )
})

export default Slide
