import styles from "./style.module.scss"

export default function Slide({ data }) {
  return (
    <div className={styles.root}>
      <img src={data} alt={"title"} className={styles.slideImage} />
    </div>
  )
}
