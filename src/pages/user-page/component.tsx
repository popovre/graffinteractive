import MessengerWindow from "../../components/messenger-window/component"
import Slider from "../../components/slider/component"
import styles from "./style.module.scss"

const UserPage = () => {
  return (
    <div className={styles.root}>
      <Slider />
      <MessengerWindow />
    </div>
  )
}

export default UserPage
