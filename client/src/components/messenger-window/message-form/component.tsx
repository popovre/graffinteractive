import styles from "./styles.module.scss"
import { useState } from "react"
// @ts-ignore
import Tg from "../../../assets/icons/tg.svg?react"

interface MessageFormProps {
  sentMessage: (message: string) => void
}

const MessageForm = ({ sentMessage }: MessageFormProps) => {
  const [message, setMessage] = useState("")

  const inputHandler = () => {
    sentMessage(message)
    setMessage("")
  }

  const onSubmit = (evt: React.SyntheticEvent) => {
    evt.preventDefault()
    inputHandler()
  }

  return (
    <form name="chat" onSubmit={onSubmit}>
      <label className={styles.label}>
        <input
          className={styles.input}
          onChange={evt => setMessage(evt.target.value)}
          placeholder="Написать сообщение..."
          value={message}
          type="text"
        />
        <button className={styles.buttonSubmit} type="submit">
          <Tg className={styles.tg} />
        </button>
      </label>
    </form>
  )
}

export default MessageForm
