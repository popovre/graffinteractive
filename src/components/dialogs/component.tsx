import styles from "./style.module.scss"

const dialogs = [
  {
    name: "Roman Evgenich",
    message: "Сообщение и что с ним происходит, если оно не влезло",
  },
  {
    name: "Roman Evgenich",
    message: "Сообщение и что с ним происходит, если оно не влезло",
  },
  {
    name: "Roman Evgenich",
    message: "Сообщение и что с ним происходит, если оно не влезло",
  },
  {
    name: "Roman Evgenich",
    message: "Сообщение и что с ним происходит, если оно не влезло",
  },
  {
    name: "Roman Evgenich",
    message: "Сообщение и что с ним происходит, если оно не влезло",
  },
]

const Dialogs = () => {
  return (
    <div className={styles.root}>
      {dialogs.map(({ name, message }) => (
        <div className={styles.dialog}>
          <span>
            {name
              ?.split(" ")
              .map(element => element[0])
              .join("")}
          </span>
          <p className={styles.name}>{name}</p>
          <p className={styles.message}>{message}</p>
        </div>
      ))}
    </div>
  )
}

export default Dialogs
