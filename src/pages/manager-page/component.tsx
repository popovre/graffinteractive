import Dialogs from "../../components/dialogs/component"
import MessengerWindow from "../../components/messenger-window/component"
import styles from "./style.module.scss"

const ManagerPage = () => {
  return (
    <div className={styles.root}>
      <Dialogs />
      <MessengerWindow client={"manager"} />
    </div>
  )
}

export default ManagerPage
