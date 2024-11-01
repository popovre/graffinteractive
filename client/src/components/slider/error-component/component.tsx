import styles from "./style.module.scss"

const ErrorComponent = ({ onClick }) => {
  return (
    <div className={styles.root}>
      <p>Произошла ошибка загрузки</p>
      <button className={styles.button} onClick={onClick}>
        Перезагрузить
      </button>
    </div>
  )
}

export default ErrorComponent
