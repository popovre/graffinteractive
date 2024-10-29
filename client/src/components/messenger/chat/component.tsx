import styles from "./style.module.scss"
import type { chat, loginFormState } from "../component"
import { useEffect, useRef } from "react"

type getInitialsType = (name: string, secondName?: string) => string

interface ChatProps {
  chat: chat
  login: loginFormState
}

const getInitials: getInitialsType = (name, secondName) =>
  `${name[0].toUpperCase()}${secondName ? secondName[0].toUpperCase() : ""}`

const Chat = ({ chat, login }: ChatProps) => {
  const windowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (windowRef.current) {
      const lastMessage = windowRef.current.children[chat.length - 1]
      lastMessage?.scrollIntoView({ behavior: "smooth" })
    }
  }, [chat])

  return (
    <div className={styles.window} ref={windowRef}>
      {chat.map(({ name, secondName, message, id }, index, array) => (
        <p
          className={`${styles.message} ${name !== login.name && styles.gotMessage} ${array[index - 1]?.name !== name && styles.topMargin}`}
          key={id}
        >
          {message}
          <span>{getInitials(name, secondName)}</span>
        </p>
      ))}
    </div>
  )
}

export default Chat
