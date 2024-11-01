import styles from "./style.module.scss"
import type { rooms, room, loginFormState } from "../component"
import Room from "./room/component"

interface DialogsProps {
  rooms: rooms
  login: loginFormState
  setLogin: ({ name, secondName, password }: loginFormState) => void
}

const Rooms = ({ rooms, login, setLogin }: DialogsProps) => {
  return (
    <div className={styles.root}>
      {Object.values(rooms).map((room: room) => (
        <Room room={room} login={login} key={room.roomId} setLogin={setLogin} />
      ))}
    </div>
  )
}

export default Rooms
