import { Link } from "react-router-dom"
import styles from "./style.module.scss"

const Header = () => {
  return (
    <div className={styles.root}>
      <nav className={styles.nav}>
        <Link to="/">Home</Link>
        <Link to="/panel">Panel</Link>
      </nav>
      <p>graff.test</p>
      <Link target="_blank" to="https://www.graff.tech/">
        GRAFF interactive
      </Link>
    </div>
  )
}

export default Header
