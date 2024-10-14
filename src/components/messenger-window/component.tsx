import styles from "./style.module.scss"
import Tg from "../../assets/icons/tg.svg?react"
import { useRef, useState } from "react"
import { useLocation } from "react-router-dom"

const PORT = 5000
const BASE_QUERY = `ws://localhost:${PORT}/`

export interface MessengerWindowProps {
  client: string
}

const MessengerWindow = ({ client }: MessengerWindowProps) => {
  const [chat, setChat] = useState([])
  const [message, setMessage] = useState("")
  const [connected, setConnected] = useState(false)
  const [username, setUsername] = useState("")
  const socketRef = useRef()

  const clientId = useLocation()

  const sentMessage = () => {
    const msg = {
      method: "chat",
      name: username,
      message: message,
      id: Date.now(),
    }
    socketRef.current.send(JSON.stringify(msg))

    setMessage("")
  }

  const connect = () => {
    socketRef.current = new WebSocket(BASE_QUERY)

    const id = Date.now()

    // setSocketState(socket)
    socketRef.current.onopen = () => {
      setConnected(true)

      const msg = {
        name: username,
        id,
        method: "connection",
      }

      socketRef.current.send(JSON.stringify(msg))
    }

    socketRef.current.onmessage = evt => {
      console.log("ws message")
      const msg = JSON.parse(evt.data)
      setChat(prev => [msg, ...prev])
    }

    socketRef.current.onclose = () => {
      console.log("ws close")
    }

    socketRef.current.onerror = () => {
      console.log("ws error")
    }
  }

  if (!connected) {
    return (
      <div className={styles.login}>
        <form
          onSubmit={evt => {
            evt.preventDefault()
            connect()
          }}
        >
          <input
            type="text"
            value={username}
            onChange={evt => {
              setUsername(evt.target.value)
            }}
            placeholder="введите ваше имя"
          />
          <button type="submit">войти</button>
        </form>
      </div>
    )
  }

  return (
    <div className={styles.root}>
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
