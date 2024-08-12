import { useContext } from "react"
import Dot from "../dot/component"
import { SliderContext } from "../../context/slider"
import styles from "./style.module.scss"

export default function Dots() {
  const { slidesCount } = useContext(SliderContext)

  const renderDots = () => {
    const dots = []
    for (let i = 0; i < slidesCount; i++) {
      dots.push(<Dot key={`dot-${i}`} number={i} />)
    }

    return dots
  }

  return <div className={styles.root}>{renderDots()}</div>
}
