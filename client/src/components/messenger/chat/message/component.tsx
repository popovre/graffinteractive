import { memo } from "react"
import styles from "./style.module.scss"
import type { WebSocketMessage } from "../../component"

type getInitialsType = (name: string, secondName?: string) => string

interface MessageProps {
  chatMessage: WebSocketMessage
  isInputMessage: boolean
  isTopMargin: boolean
}

const Message: React.FC<MessageProps> = memo(function Message({
  chatMessage,
  isInputMessage,
  isTopMargin,
}) {
  const { name, secondName, message, id } = chatMessage

  console.log("render message")

  const getInitials: getInitialsType = (name, secondName) =>
    `${name[0].toUpperCase()}${secondName ? secondName[0].toUpperCase() : ""}`

  return (
    <p
      className={`${styles.message} ${isInputMessage && styles.gotMessage} ${isTopMargin && styles.topMargin}`}
      key={id}
    >
      {message}
      <span>{getInitials(name, secondName)}</span>
    </p>
  )
})

export default Message
