import styles from "./style.module.scss"
import type { rooms, room } from "../component"
import Dialog from "./dialog/component"

interface DialogsProps {
  rooms: rooms
  setLogin: () => void
}

const Dialogs = ({ rooms, setLogin }: DialogsProps) => {
  return (
    <div className={styles.root}>
      {Object.values(rooms).map((room: room, index) => (
        <Dialog room={room} key={room.roomId} setLogin={setLogin} />
      ))}
    </div>
  )
}

export default Dialogs
