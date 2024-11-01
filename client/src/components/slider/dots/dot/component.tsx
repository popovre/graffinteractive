import { memo, useContext } from "react"
import { SliderContext } from "../../../../context/slider"
import styles from "./style.module.scss"

export interface DotProps {
  index: number
  isActive: boolean
}

const Dot: React.FC<DotProps> = memo(function Dot({ index, isActive }) {
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
