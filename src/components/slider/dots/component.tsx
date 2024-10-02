import Dot from "./dot/component"
import styles from "./style.module.scss"

export default function Dots({ slides }) {
  return (
    <div className={styles.root}>
      <div className={styles.dotsWrapper}>
        {slides.map((slide, index) => (
          <Dot key={`dot-${slide.id}`} number={index} />
        ))}
      </div>
    </div>
  )
}
