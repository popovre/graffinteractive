import styles from "./style.module.scss"

import type { room, loginFormState } from "../../component"

interface DialogProps {
  room: room
  login: loginFormState
  setLogin: ({ name, secondName, password }: loginFormState) => void
}

type getInitialsType = (name: string, secondName?: string) => string

const Room = ({ room, login, setLogin }: DialogProps) => {
  const { name, roomId, message, secondName } = room

  const getInitials: getInitialsType = (name, secondName) =>
    `${name ? name[0].toUpperCase() : ""}${secondName ? secondName[0].toUpperCase() : ""}`

  return (
    <div
      className={styles.root}
      onClick={() => {
        console.log("click")
        setLogin({
          name: login.name,
          secondName: login.secondName,
          password: roomId,
        })
      }}
    >
      <p className={styles.name}>{name}</p>
      <p className={styles.message}>{message}</p>
      <span>{getInitials(name, secondName)}</span>
    </div>
  )
}

export default Room
