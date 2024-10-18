import styles from "./styles.module.scss"
import { useLogin } from "./use-login"

import type { loginFormState } from "../component"

interface LoginProps {
  setUser: (user: loginFormState) => void
}

const INITIAL_FORM: loginFormState = {
  name: "",
  secondName: "",
}

const Login = ({ setUser }: LoginProps) => {
  const [form, setName, setSecondName] = useLogin(INITIAL_FORM)

  return (
    <div className={styles.root}>
      <form
        className={styles.form}
        onSubmit={evt => {
          evt.preventDefault()
          if (form.name !== "") {
            setUser({
              name: form.name.trim(),
              secondName: form.secondName?.trim(),
            })
          }
        }}
      >
        <input
          className={styles.input}
          type="text"
          value={form.name}
          onChange={evt => {
            setName(evt)
          }}
          placeholder="введите ваше имя"
          required
        />
        <input
          className={styles.input}
          type="text"
          value={form.secondName}
          onChange={evt => {
            setSecondName(evt)
          }}
          placeholder="введите вашу фамилию"
        />

        <button className={styles.submit} type="submit">
          войти
        </button>
      </form>
    </div>
  )
}

export default Login
