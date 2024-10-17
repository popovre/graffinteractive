import styles from "./style.module.scss"
import { BASE_WS_QUERY } from "../../constants"
import { useEffect, useRef, useState } from "react"
import Login from "../login/component"
// @ts-ignore
import Tg from "../../assets/icons/tg.svg?react"

export interface MessengerWindowProps {
  children?: React.ReactElement
  client: string
}

interface WebSocketMessage {
  method: `connection` | `chat`
  name: string
  id: number
  message?: string
  input?: boolean
}

export type chat = WebSocketMessage[]

const MessengerWindow = ({ children, client }: MessengerWindowProps) => {
  const [chat, setChat] = useState<chat>([])
  const [message, setMessage] = useState("")
  const [connected, setConnected] = useState(false)
  const [username, setUsername] = useState(client === "manager" ? client : "")

  const socketRef = useRef<WebSocket | null>(null)

  const sentMessage = () => {
    const msg = {
      method: "chat",
      name: username,
      message: message,
      id: Date.now(),
    }

    socketRef.current?.send(JSON.stringify(msg))

    setMessage("")
  }

  useEffect(() => {
    if (username || client === "manager") {
      socketRef.current = new WebSocket(BASE_WS_QUERY)
      const id = Date.now()

      socketRef.current.onopen = () => {
        setConnected(true)

        const msg: WebSocketMessage = {
          name: username,
          id,
          method: "connection",
        }

        console.log(msg, "msg")

        socketRef.current?.send(JSON.stringify(msg))
      }

      socketRef.current.onmessage = evt => {
        console.log("ws message")
        const parsedMsg: WebSocketMessage = JSON.parse(evt.data)
        setChat(prev => [...prev, parsedMsg])
      }

      socketRef.current.onclose = () => {
        setConnected(false)
        console.log("ws close")
      }

      socketRef.current.onerror = () => {
        console.log("ws error")
      }
    }
  }, [username, client])

  return (
    <div className={styles.root}>
      {client === "user" && !connected && <Login setUsername={setUsername} />}
      <h2 className={styles.title}>Чат с</h2>
      <div className={styles.window}>
        {chat.map(({ input, name, message, method, id }, index, array) => {
          return method === "connection" ? (
            <p className={styles.message} key={id}>
              {`Пользователь ${name} подключился`}
            </p>
          ) : (
            <p
              className={`${styles.message} ${input && styles.gotMessage} ${array[index - 1]?.input !== input && styles.topMargin}`}
              key={id}
            >
              {name + `:`}
              {message}
              {array[index + 1]?.input !== input && <span>{name}</span>}
            </p>
          )
        })}
      </div>
      <form
        name="chat"
        onSubmit={evt => {
          evt.preventDefault()
          sentMessage()
          console.log("submit")
        }}
      >
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
    </div>
  )
}

export default MessengerWindow
