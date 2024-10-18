import styles from "./style.module.scss"
import { BASE_WS_QUERY } from "../../constants"
import { useEffect, useRef, useState } from "react"
import Login from "./login/component"

import MessageForm from "./message-form/component"

export interface MessengerWindowProps {
  children?: React.ReactElement
  client: string
}

interface WebSocketMessage {
  method: `connection` | `chat`
  name: string
  secondName?: string
  id: number
  message?: string
  input?: boolean
}

export interface loginFormState {
  name: string
  secondName?: string
}

export type chat = WebSocketMessage[]

interface connection {
  contact: string
  connected: boolean
}

type getInitials = (name: string, secondName?: string) => string

const MessengerWindow = ({ children, client }: MessengerWindowProps) => {
  const [chat, setChat] = useState<chat>([])
  const [connection, setConnection] = useState<connection>({
    contact: "",
    connected: false,
  })

  const [user, setUser] = useState<loginFormState>(
    client === "manager" ? { name: client } : { name: "" },
  )

  const socketRef = useRef<WebSocket | null>(null)

  const getInitials: getInitials = (name, secondName) =>
    `${name[0].toUpperCase()}${secondName ? secondName[0].toUpperCase() : ""}`

  const sentMessage = (message: string) => {
    const msg = {
      method: "chat",
      name: user.name,
      secondName: user.secondName,
      message: message,
      id: Date.now(),
    }

    socketRef.current?.send(JSON.stringify(msg))
  }

  useEffect(() => {
    if (user.name || client === "manager") {
      socketRef.current = new WebSocket(BASE_WS_QUERY)
      const id = Date.now()

      socketRef.current.onopen = () => {
        setConnection({ ...connection, connected: true })

        const msg: WebSocketMessage = {
          name: user.name,
          id,
          method: "connection",
        }

        console.log(msg, "msg")

        socketRef.current?.send(JSON.stringify(msg))
      }

      socketRef.current.onmessage = evt => {
        console.log("ws message")
        const parsedMsg: WebSocketMessage = JSON.parse(evt.data)

        switch (parsedMsg.method) {
          case "connection": {
            setConnection((prev: connection) => ({
              ...prev,
              contact: parsedMsg.name,
            }))
            break
          }
          case "chat": {
            console.log(parsedMsg, "parsedMsg")
            setChat(prev => [...prev, parsedMsg])
            break
          }
          default: {
            console.log("default case")
          }
        }
      }

      socketRef.current.onclose = () => {
        setConnection((prev: connection) => ({
          ...prev,
          connected: false,
        }))

        console.log("ws close")
      }

      socketRef.current.onerror = () => {
        console.log("ws error")
      }
    }
  }, [user.name, client])

  return (
    <div className={styles.root}>
      {client !== "manager" && !connection.connected && (
        <Login setUser={setUser} />
      )}
      {children}
      <div className={styles.windowRoot}>
        <h2 className={styles.title}>Чат с {connection.contact}</h2>
        <div className={styles.window}>
          {chat.map(
            (
              { input, name, secondName, message, method, id },
              index,
              array,
            ) => (
              <p
                className={`${styles.message} ${input && styles.gotMessage} ${array[index - 1]?.input !== input && styles.topMargin}`}
                key={id}
              >
                {message}
                <span>{getInitials(name, secondName)}</span>
              </p>
            ),
          )}
        </div>
        <MessageForm sentMessage={sentMessage} />
      </div>
    </div>
  )
}

export default MessengerWindow
