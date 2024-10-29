import Messenger from "../../components/messenger/component"
import Slider from "../../components/slider/component"
import styles from "./style.module.scss"

const UserPage = () => {
  return (
    <div className={styles.root}>
      <Slider />
      <Messenger userStatus={"user"} />
    </div>
  )
}

export default UserPage
