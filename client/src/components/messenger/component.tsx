import styles from "./style.module.scss"
import { BASE_WS_QUERY } from "../../constants"
import { useEffect, useRef, useState } from "react"
import Login from "./login/component"

import MessageForm from "./message-form/component"
import Rooms from "./rooms/component"
import Chat from "./chat/component"

type userStatus = "manager" | "client"

export interface MessengerProps<status> {
  children?: React.ReactElement
  userStatus: status
}

type messageMethod =
  | "notifyManagers"
  | `connection`
  | `chat`
  | "updateLastMessage"

interface serviceRoom {
  roomId: string
  name: string
}

interface service {
  rooms: { [roomId: string]: serviceRoom }
  roomClients: string
  messages?: WebSocketMessage[]
}

export interface WebSocketMessage {
  method: messageMethod
  name: string
  secondName?: string
  messageId: number
  socketId?: number
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

export interface room {
  clients?: string[]
  roomId: string
  name: string
  secondName?: string
  message?: string
}

export interface rooms {
  [roomId: string]: room
}

export type sendMessage = (method: messageMethod, message: string) => void

const Messenger = ({ userStatus }: MessengerProps<userStatus>) => {
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

  const sendMessage = (
    method: messageMethod,
    message: string = "",
    socketId?: number,
  ) => {
    const msg: WebSocketMessage = {
      messageId: Date.now(),
      socketId,
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
            parsedMsg.service?.messages
              ? setChat(parsedMsg.service?.messages)
              : setChat([])

            setConnection((prev: connection) => ({
              ...prev,
              contact: parsedMsg.service
                ? parsedMsg.service.roomClients
                    .split(" ")
                    .filter((name, ind, array) => {
                      return parsedMsg.roomId === "manager"
                        ? array.indexOf(name) === ind
                          ? name
                          : false
                        : name !== login.name
                    })
                    .join(", ")
                : "",
            }))

            if (parsedMsg.service?.rooms) {
              setRooms(parsedMsg.service.rooms)
            } else {
              setRooms({})
            }

            break
          }
          case "notifyManagers": {
            setRooms((prev: rooms) => ({
              ...prev,
              [parsedMsg.roomId]: {
                roomId: parsedMsg.roomId,
                name: parsedMsg.name,
                secondName: parsedMsg.secondName,
                message: parsedMsg.message,
              },
            }))
            break
          }
          case "updateLastMessage": {
            setRooms((prev: rooms) => ({
              ...prev,
              [parsedMsg.roomId]: {
                ...prev[parsedMsg.roomId],
                message: parsedMsg.message,
              },
            }))
            break
          }
          case "chat": {
            setChat(prev => [...prev, parsedMsg])

            break
          }
        }
      }

      socketRef.current.onclose = () => {
        setConnection((prev: connection) => ({
          ...prev,
          connected: false,
        }))
      }

      socketRef.current.onerror = () => {}
    }
    return () => {
      socketRef.current?.close()
    }
  }, [login, userStatus])

  return (
    <div className={styles.root}>
      {userStatus !== "manager" && !connection.connected && (
        <Login setLogin={setLogin} />
      )}
      {userStatus === "manager" && (
        <Rooms rooms={rooms} login={login} setLogin={setLogin} />
      )}
      <div className={styles.windowRoot}>
        <h2 className={styles.title}>
          Чат с {userStatus === "manager" ? connection.contact : "manager"}
        </h2>
        <Chat chat={chat} login={login} />
        <MessageForm sendMessage={sendMessage} />
      </div>
    </div>
  )
}

export default Messenger
