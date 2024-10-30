import styles from "./style.module.scss"
import type { chat, loginFormState } from "../component"
import { memo, useEffect, useRef } from "react"
import Message from "./message/component"

interface ChatProps {
  chat: chat
  login: loginFormState
}

const Chat = memo(function Chat({ chat, login }: ChatProps) {
  const windowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (windowRef.current) {
      const lastMessage = windowRef.current.children[chat.length - 1]
      lastMessage?.scrollIntoView({ behavior: "smooth" })
    }
  }, [chat])

  return (
    <div className={styles.window} ref={windowRef}>
      {chat.map((chatMessage, index, array) => (
        <Message
          chatMessage={chatMessage}
          isInputMessage={chatMessage.name !== login.name}
          isTopMargin={array[index - 1]?.name !== chatMessage.name}
        />
      ))}
    </div>
  )
})

export default Chat
