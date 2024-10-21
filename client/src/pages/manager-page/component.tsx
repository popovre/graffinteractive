import MessengerWindow from "../../components/messenger-window/component"
import styles from "./style.module.scss"

const ManagerPage = () => {
  return (
    <div className={styles.root}>
      <MessengerWindow client={"manager"} />
    </div>
  )
}

export default ManagerPage
