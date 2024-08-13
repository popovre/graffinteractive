import Dialogs from "../../components/dialogs/component"
import MessengerWindow from "../../components/messenger-window/component"
import styles from "./style.module.scss"

const PanelPage = () => {
  return (
    <div className={styles.root}>
      <Dialogs />
      <MessengerWindow />
    </div>
  )
}

export default PanelPage
