type ReducerAction = {
  type: 'set'
  data: string
}

export const reducer = (state: string, action: ReducerAction) => {
  switch (action.type) {
    case 'set':
      return action.data
    default:
      return ''
  }
}
