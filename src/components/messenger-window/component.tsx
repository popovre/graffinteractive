import styles from "./style.module.scss"
import Tg from "../../assets/icons/tg.svg?react"
import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"

const PORT = 5000
const BASE_QUERY = `ws://localhost:${PORT}/`

export interface MessengerWindowProps {
  client: string
}

const MessengerWindow = ({ client }: MessengerWindowProps) => {
  const [socketState, setSocketState] = useState()
  const [chat, setChat] = useState([])
  const [members, setMembers] = useState("")
  const [message, setMessage] = useState("")
  const windowRef = useRef()

  const clientId = useLocation()

  const chatHandler = msg => {
    setChat(prevMessages => [
      ...prevMessages,
      { input: msg.input, message: msg.message, name: msg.name },
    ])
  }

  const chatButtonHandler = socket => {
    socket.send(
      JSON.stringify({
        method: "chat",
        input: false,
        name: clientId.pathname === "/client" ? "C C" : "M M",
        message: message || "empty",
        id: clientId.pathname,
      }),
    )

    setMessage("")
  }

  useEffect(() => {
    const socket = new WebSocket(BASE_QUERY)
    setSocketState(socket)
    socket.onopen = () => {
      console.log("WS connection completed")
      socket.send(
        JSON.stringify({ id: clientId.pathname, method: "connection" }),
      )
      socket.onmessage = evt => {
        let msg = JSON.parse(evt.data)
        console.log(msg, "msg")

        switch (msg.method) {
          case "connection": {
            console.log(`user connected`, msg.id, clientId.pathname)
            if (msg.id !== clientId.pathname) setMembers(msg.id)
            break
          }
          case "chat": {
            console.log("chat")
            chatHandler(msg)
            break
          }
        }
      }
    }
  }, [clientId.pathname])
  return (
    <div className={styles.root}>
      <h2 className={styles.title}>Чат с {members}</h2>
      <div className={styles.window} ref={windowRef}>
        {chat.map(({ input, name, message }, index, array) => {
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
      <form
        name="chat"
        onSubmit={evt => {
          evt.preventDefault()
          chatButtonHandler(socketState)
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
