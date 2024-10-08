import { memo } from "react"
import Dot from "./dot/component"
import styles from "./style.module.scss"

import type { slides } from "../component"

export interface DotsProps {
  slides: slides
  slideIndex: number
}

const Dots: React.FC<DotsProps> = memo(function Dots({ slides, slideIndex }) {
  return (
    <div className={styles.root}>
      <div className={styles.dotsWrapper}>
        {slides.map((slide, index) => (
          <Dot
            key={`dot-${slide.id}`}
            index={index}
            isActive={index === slideIndex}
          />
        ))}
      </div>
    </div>
  )
})

export default Dots
