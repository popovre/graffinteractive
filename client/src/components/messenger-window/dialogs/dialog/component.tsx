import styles from "./style.module.scss"

import type { room } from "../../component"

interface DialogProps {
  room: room
  setLogin: () => void
}

const Dialog = ({ room, setLogin }: DialogProps) => {
  const { name, roomId } = room
  return (
    <div
      className={styles.root}
      onClick={() => {
        setLogin()
      }}
    >
      <p className={styles.name}>{name}</p>
      <p className={styles.message}>{roomId}</p>
    </div>
  )
}

export default Dialog
