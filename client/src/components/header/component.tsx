import { Link, NavLink } from "react-router-dom"
import styles from "./style.module.scss"

const Header = () => {
  return (
    <div className={styles.root}>
      <nav className={styles.nav}>
        <NavLink className={styles.link} to="/user">
          {({ isActive }) => (
            <button className={styles.button} disabled={isActive}>
              User
            </button>
          )}
        </NavLink>
        <NavLink className={styles.link} to="/manager">
          {({ isActive }) => (
            <button className={styles.button} disabled={isActive}>
              Manager
            </button>
          )}
        </NavLink>
      </nav>
      <p>graff.test</p>
      <Link target="_blank" to="https://www.graff.tech/">
        GRAFF interactive
      </Link>
    </div>
  )
}

export default Header
