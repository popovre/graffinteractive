import Messenger from "../../components/messenger/component"
import styles from "./style.module.scss"

const ManagerPage = () => {
  return (
    <div className={styles.root}>
      <Messenger userStatus={"manager"} />
    </div>
  )
}

export default ManagerPage
