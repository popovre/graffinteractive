import styles from "./style.module.scss"
import Tg from "../../assets/icons/tg.svg?react"

const messages = [
  {
    input: true,
    name: "КЕ",
    message: "Информативное сообщение с просьбой, в две строки",
  },
  {
    input: true,
    name: "КЕ",
    message: "Информативное сообщение с просьбой, в две строки",
  },

  {
    input: false,
    name: "ИФ",
    message: "Информативное сообщение с просьбой, в две строки",
  },
  {
    input: false,
    name: "ИФ",
    message: "Информативное сообщение с просьбой, в две строки",
  },
  {
    input: true,
    name: "КЕ",
    message: "Информативное сообщение с просьбой, в две строки",
  },
]

const MessengerWindow = () => {
  return (
    <div className={styles.root}>
      <h2 className={styles.title}>Чат с поддержкой</h2>
      <div className={styles.window}>
        {messages.map(({ input, name, message }, index, array) => {
          return (
            <p
              className={`${styles.message} ${input && styles.gotMessage} ${array[index - 1]?.input !== input && styles.topMargin}`}
              key={index}
            >
              {message}
              {array[index + 1]?.input !== input && <span>{name}</span>}
            </p>
          )
        })}
      </div>
      <label className={styles.label}>
        <input
          className={styles.input}
          placeholder="Написать сообщение..."
          type="text"
        />
        <button className={styles.buttonSubmit} type="button">
          <Tg className={styles.tg} />
        </button>
      </label>
    </div>
  )
}

export default MessengerWindow
