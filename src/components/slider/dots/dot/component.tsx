import { memo, useContext } from "react"
import { SliderContext } from "../../../../context/slider"
import styles from "./style.module.scss"

const Dot = memo(function Dot({ index, isActive }) {
  console.log("dot render")
  const { goToSlide } = useContext(SliderContext)

  return (
    <div
      className={`${styles.root} ${isActive && styles.selected}`}
      onClick={() => {
        goToSlide(index)
      }}
    />
  )
})

export default Dot
