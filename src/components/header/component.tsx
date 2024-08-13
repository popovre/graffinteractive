import { Link, NavLink } from "react-router-dom"
import styles from "./style.module.scss"

const Header = () => {
  return (
    <div className={styles.root}>
      <nav className={styles.nav}>
        <NavLink className={styles.link} to="/">
          {({ isActive }) => (
            <button className={styles.button} disabled={isActive}>
              Home
            </button>
          )}
        </NavLink>
        <NavLink className={styles.link} to="/panel">
          {({ isActive }) => (
            <button className={styles.button} disabled={isActive}>
              Panel
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

{
  /* <NavLink to="menu">
{({ isActive }) => (
  <button className={classNames(styles.button)} disabled={isActive}>
    Menu
  </button>
)}
</NavLink> */
}

export default Header
