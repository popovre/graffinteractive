import styles from "./style.module.scss"
import Tg from "../../assets/icons/tg.svg?react"

const MessengerWindow = () => {
  return (
    <div className={styles.root}>
      <h2 className={styles.title}>Чат с поддержкой</h2>
      <div className={styles.window}>
        <p className={styles.span}>
          Информативное сообщение с просьбой, в две строки
        </p>
        <p className={styles.span}>
          Информативное сообщение с просьбой, в две строки
        </p>
        <p className={styles.span}>
          Информативное сообщение с просьбой, в две строки
        </p>
        <p className={styles.span}>
          Информативное сообщение с просьбой, в две строки
        </p>
        <p className={styles.span}>
          Информативное сообщение с просьбой, в две строки
        </p>
      </div>
      <label className={styles.label}>
        <input
          className={styles.input}
          placeholder="Написать сообщение..."
          type="text"
        />
        <button className={styles.buttonSubmit} type="button">
          <Tg />
        </button>
      </label>
    </div>
  )
}

export default MessengerWindow
