import { useCallback, useReducer } from "react"

import type { loginFormState } from "../component"

interface loginType {
  type: "setName" | "setSecondName" | "setPassword"
  payload: string
}

type UseLogin = (
  initialState: loginFormState,
) => [
  loginFormState,
  (evt: React.SyntheticEvent) => void,
  (evt: React.SyntheticEvent) => void,
  (evt: React.SyntheticEvent) => void,
]

const reducer = (state: loginFormState, { type, payload }: loginType) => {
  switch (type) {
    case "setName":
      return { ...state, name: payload }
    case "setSecondName":
      return { ...state, secondName: payload }
    case "setPassword":
      return { ...state, password: payload }
    default:
      return { ...state }
  }
}

export const useLogin: UseLogin = initialState => {
  const [form, dispatch] = useReducer(reducer, initialState)

  const setName = useCallback((evt: React.SyntheticEvent) => {
    const target = evt.target as HTMLInputElement
    dispatch({ type: "setName", payload: target.value })
  }, [])

  const setSecondName = useCallback((evt: React.SyntheticEvent) => {
    const target = evt.target as HTMLInputElement
    dispatch({ type: "setSecondName", payload: target.value })
  }, [])

  const setPassword = useCallback((evt: React.SyntheticEvent) => {
    const target = evt.target as HTMLInputElement
    dispatch({ type: "setPassword", payload: target.value })
  }, [])

  return [form, setName, setSecondName, setPassword]
}
