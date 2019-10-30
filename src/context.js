import React, { createContext } from 'react'

export const LiveContext = createContext()

export const LiveProvider = ({ client, children }) => (
  <LiveContext.Provider value={client}>
    {children}
  </LiveContext.Provider>
)

export const LiveConsumer = LiveContext.Consumer
