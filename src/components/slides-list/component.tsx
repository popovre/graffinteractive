import { useContext } from "react"
import Slide from "../slide/component"
import { SliderContext } from "../slider/component"

import "../styles.scss"

export default function SlidesList() {
  const { slideNumber, items } = useContext(SliderContext)

  return (
    <div
      className="slide-list"
      style={{ transform: `translateX(-${slideNumber * 100}%)` }}
    >
      {items.map((slide, index) => (
        <Slide key={index} data={slide} />
      ))}
    </div>
  )
}
