import styles from "./style.module.scss"

export default function Slide({ data }) {
  return (
    <div className={styles.root}>
      <div className={styles.slideTitle}>{"title"}</div>
      <img src={data} alt={"title"} className={styles.slideImage} />
    </div>
  )
}
