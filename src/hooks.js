import { useContext, useState, useEffect, useCallback } from 'react'
import lodash from 'lodash'
import { LiveContext } from './context'

export const useLiveClient = () => {
  return useContext(LiveContext)
}

export const useQuery = (query, input, context) => {
  const client = useLiveClient()
  const [state, setState] = useState({
    loading: true,
    output: null
  })

  useEffect(
    () => {
      let active = true
      setState(state => ({ ...state, loading: true }))
      const observer = client.query(query, input, context)

      if(lodash.isFunction(observer.then)) {
        observer.then(output => {
          active && setState({ loading: false, output })
        })
        return () => {
          active = false
        }
      }
      else {
        const subscription = observer.subscribe(output => {
          active && setState({ loading: false, output })
        })
        return () => {
          active = false
          subscription.unsubscribe()
        }
      }
    },
    [query, input, context, client]
  )

  return state
}

export const useAction = (action, input, context) => {
  const client = useLiveClient()
  const [state, setState] = useState({
    loading: false,
    output: null
  })

  const call = useCallback(
    (lateInput, lateContext) => {
      setState(state => ({ ...state, loading: true }))
      client.action(action, lateInput || input, lateContext || context).then(output => {
        setState({ loading: false, output })
      })
    },
    [action, input, context, client]
  )

  return [call, state]
}
