import { createContext } from "react"

export interface ISliderContext {
  goToSlide?: (index: number) => void
  slideIndex: number
}

export const SliderContext = createContext<ISliderContext>({
  slideIndex: 0,
})
