import styles from "./style.module.scss"

export default function Slide({ slide }) {
  return (
    <div className={styles.root}>
      <img src={slide?.src} alt={slide?.alt} className={styles.slideImage} />
    </div>
  )
}
