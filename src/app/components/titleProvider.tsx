import {
  createContext,
  Dispatch,
  FunctionComponent,
  PropsWithChildren,
  SetStateAction,
  useState,
} from 'react'

export const TitleContext = createContext<
  [string, Dispatch<SetStateAction<string>>]
>(['', () => {}])

export const TitleProvider: FunctionComponent<
  PropsWithChildren<{}>
> = props => {
  const { children } = props

  const titleState = useState('')

  return (
    <TitleContext.Provider value={titleState}>{children}</TitleContext.Provider>
  )
}
