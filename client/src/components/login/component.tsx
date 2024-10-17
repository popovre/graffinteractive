import { useState } from "react"
import styles from "./styles.module.scss"

interface LoginProps {
  setUsername: (str: string) => void
}

const Login = ({ setUsername }: LoginProps) => {
  const [state, setState] = useState("")

  return (
    <div className={styles.root}>
      <form
        className={styles.form}
        onSubmit={evt => {
          evt.preventDefault()
          if (state !== "") {
            const trimmedName = state.trim()
            setUsername(trimmedName)
          }
        }}
      >
        <input
          className={styles.input}
          type="text"
          value={state}
          onChange={evt => {
            setState(evt.target.value)
          }}
          placeholder="введите ваше имя"
        />

        <button className={styles.submit} type="submit">
          войти
        </button>
      </form>
    </div>
  )
}

export default Login
