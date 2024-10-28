import styles from "./style.module.scss"
import type { rooms, room, loginFormState } from "../component"
import Dialog from "./dialog/component"

interface DialogsProps {
  rooms: rooms
  login: loginFormState
  setLogin: ({ name, secondName, password }: loginFormState) => void
}

const Dialogs = ({ rooms, login, setLogin }: DialogsProps) => {
  return (
    <div className={styles.root}>
      {Object.values(rooms).map((room: room, index) => (
        <Dialog
          room={room}
          login={login}
          key={room.roomId}
          setLogin={setLogin}
        />
      ))}
    </div>
  )
}

export default Dialogs
