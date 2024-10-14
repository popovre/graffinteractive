import { NavLink } from "react-router-dom"
import styles from "./style.module.scss"

const ErrorPage = () => {
  return (
    <div className={styles.root}>
      <h1>Произошла ошибка загрузки</h1>
      <NavLink className={styles.link} to="/">
        Вернуться на стартовую страницу
      </NavLink>
    </div>
  )
}

export default ErrorPage
