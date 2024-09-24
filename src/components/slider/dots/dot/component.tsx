import { useContext } from "react"
import { SliderContext } from "../../../../context/slider"
import styles from "./style.module.scss"

export default function Dot({ number }) {
  const { goToSlide, slideNumber } = useContext(SliderContext)

  return (
    <div
      className={`${styles.root} ${slideNumber === number && styles.selected}`}
      onClick={() => {
        goToSlide(number)
      }}
    />
  )
}
