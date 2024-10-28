import styles from "./style.module.scss"
import { BASE_WS_QUERY } from "../../constants"
import { useEffect, useRef, useState } from "react"
import Login from "./login/component"

import MessageForm from "./message-form/component"
import Dialogs from "./dialogs/component"

type userStatus = "manager" | "client"

export interface MessengerWindowProps<status> {
  children?: React.ReactElement
  userStatus: status
}

type messageMethod = "broadcastRoom" | `connection` | `chat`

interface serviceRoom {
  roomId: string
}

interface service {
  rooms: { [roomId: string]: serviceRoom }
  roomClients: string
}

interface WebSocketMessage {
  method: messageMethod
  name: string
  secondName?: string
  id: number
  roomId: string
  message?: string
  service?: service
}

export interface loginFormState {
  name: string
  secondName?: string
  password: string
}

export type chat = WebSocketMessage[]

interface connection {
  contact: string
  connected: boolean
  id: number
}

type getInitials = (name: string, secondName?: string) => string

export interface room {
  clients?: string[]
  roomId: string
  name?: string
  secondName?: string
}

export interface rooms {
  [roomId: string]: room
}

const MessengerWindow = ({ userStatus }: MessengerWindowProps<userStatus>) => {
  const [chat, setChat] = useState<chat>([])
  const [connection, setConnection] = useState<connection>({
    contact: "",
    connected: false,
    id: 0,
  })

  const [rooms, setRooms] = useState<rooms>({})

  const [login, setLogin] = useState<loginFormState>({
    name: userStatus === "manager" ? userStatus : "",
    secondName: "",
    password: userStatus === "manager" ? userStatus : "",
  })

  const socketRef = useRef<WebSocket | null>(null)
  const windowRef = useRef<HTMLDivElement>(null)

  const getInitials: getInitials = (name, secondName) =>
    `${name[0].toUpperCase()}${secondName ? secondName[0].toUpperCase() : ""}`

  const sendMessage = (
    method: messageMethod,
    message: string = "",
    id: number = Date.now(),
  ) => {
    const msg: WebSocketMessage = {
      id,
      method: method,
      name: login.name,
      secondName: login.secondName,
      message: message,
      roomId: login.password,
    }

    socketRef.current?.send(JSON.stringify(msg))
  }

  useEffect(() => {
    if (login.name || userStatus === "manager") {
      socketRef.current = new WebSocket(BASE_WS_QUERY)

      socketRef.current.onopen = () => {
        const socketId = Date.now()

        setConnection({ ...connection, connected: true, id: socketId })
        sendMessage("connection", "", socketId)
      }

      socketRef.current.onmessage = evt => {
        const parsedMsg: WebSocketMessage = JSON.parse(evt.data)

        switch (parsedMsg.method) {
          case "connection": {
            console.log("got connection", parsedMsg)
            setChat([])
            setConnection((prev: connection) => ({
              ...prev,
              contact: parsedMsg.service
                ? parsedMsg.service.roomClients
                    .split(" ")
                    .filter(name => {
                      console.log(name)
                      return name !== login.name
                    })
                    .join(" ")
                : "",
            }))
            parsedMsg.service ? setRooms(parsedMsg.service.rooms) : setRooms({})
            break
          }
          case "broadcastRoom": {
            console.log("broadcastRoom", parsedMsg)
            setRooms((prev: rooms) => ({
              ...prev,
              [parsedMsg.roomId]: {
                roomId: parsedMsg.roomId,
                name: parsedMsg?.name,
              },
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
    return () => {
      socketRef.current?.close()
    }
  }, [login, userStatus])

  useEffect(() => {
    if (windowRef.current) {
      const lastMessage = windowRef.current.children[chat.length - 1]
      lastMessage?.scrollIntoView({ behavior: "smooth" })
    }
  }, [chat])

  return (
    <div className={styles.root}>
      {userStatus !== "manager" && !connection.connected && (
        <Login setLogin={setLogin} />
      )}
      {userStatus === "manager" && (
        <Dialogs rooms={rooms} login={login} setLogin={setLogin} />
      )}
      <div className={styles.windowRoot}>
        <h2 className={styles.title}>
          Чат с {userStatus === "manager" ? connection.contact : "manager"}
        </h2>
        <div className={styles.window} ref={windowRef}>
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
        <MessageForm sendMessage={sendMessage} />
      </div>
    </div>
  )
}

export default MessengerWindow
