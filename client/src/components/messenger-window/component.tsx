import styles from "./style.module.scss"
import { BASE_WS_QUERY } from "../../constants"
// @ts-ignore
import Tg from "../../assets/icons/tg.svg?react"
import { useRef, useState } from "react"
import Login from "../login/component"

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
  const [username, setUsername] = useState("")

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

  const connect = () => {
    socketRef.current = new WebSocket(BASE_WS_QUERY)

    const id = Date.now()

    // setSocketState(socket)
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
      setChat(prev => [parsedMsg, ...prev])
    }

    socketRef.current.onclose = () => {
      console.log("ws close")
    }

    socketRef.current.onerror = () => {
      console.log("ws error")
    }
  }

  // if (!connected) {
  //   return (
  //     <div className={styles.login}>
  //       <form
  //         onSubmit={evt => {
  //           evt.preventDefault()
  //           connect()
  //         }}
  //       >
  //         <input
  //           type="text"
  //           value={username}
  //           onChange={evt => {
  //             setUsername(evt.target.value)
  //           }}
  //           placeholder="введите ваше имя"
  //         />
  //         <button type="submit">войти</button>
  //       </form>
  //     </div>
  //   )
  // }

  return (
    <div className={styles.root}>
      {client === "user" && !connected && <Login setUsername={setUsername} />}
      <h2 className={styles.title}>Чат с</h2>
      <div className={styles.window}>
        {chat.map(({ input, name, message, method, id }, index, array) => {
          console.log({ input, name, message, method, id }, "got msg")
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
