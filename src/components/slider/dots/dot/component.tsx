import { useContext } from "react"
import { SliderContext } from "../../../../context/slider"
import styles from "./style.module.scss"

export default function Dot({ number }) {
  const { goToSlide, slideIndex } = useContext(SliderContext)

  return (
    <div
      className={`${styles.root} ${slideIndex === number && styles.selected}`}
      onClick={() => {
        goToSlide(number)
      }}
    />
  )
}
