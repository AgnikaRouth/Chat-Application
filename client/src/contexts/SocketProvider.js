import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const SocketContext = React.createContext()

//custom hook
export function useSocket() {
  return useContext(SocketContext)
}

export function SocketProvider({ id, children }) {
    //create state
  const [socket, setSocket] = useState() 

  useEffect(() => {
    const newSocket = io(
      'http://localhost:5000',
      { query: { id } }  
    )
    setSocket(newSocket)

    return () => newSocket.close() //remove old socket
  }, [id])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}