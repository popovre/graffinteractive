import styles from "./style.module.scss"

import type { room, loginFormState } from "../../component"

interface DialogProps {
  room: room
  setLogin: ({ name, secondName, password }: loginFormState) => void
  login: loginFormState
}

const Dialog = ({ room, login, setLogin }: DialogProps) => {
  const { name, roomId } = room
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
      <p className={styles.message}>{roomId}</p>
    </div>
  )
}

export default Dialog
