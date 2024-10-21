import styles from "./style.module.scss"
import type { users } from "../messenger-window/component"

interface DialogsProps {
  users: users
}

const Dialogs = ({ users }: DialogsProps) => {
  return (
    <div className={styles.root}>
      {users?.map(({ name, id }, index) => (
        <div className={styles.dialog} key={index}>
          <p className={styles.name}>{name}</p>
          {/* <p className={styles.message}>{message}</p> */}
        </div>
      ))}
    </div>
  )
}

export default Dialogs
