import React, { useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';

const ContactsContext = React.createContext()

//to be used in NewContactModal Component
export function useContacts() {
  return useContext(ContactsContext)
}

export function ContactsProvider({ children }) { //children is a react component to render

   //create state, default is empty array of contacts. Starting with zero contacts 
  const [contacts, setContacts] = useLocalStorage('contacts', [])

  //append new contacts at the end of prevContacts
  function createContact(id, name) {
    setContacts(prevContacts => {
      return [...prevContacts, { id, name }]
    })
  }

  //to render out ContactsProvider and the values in it
  return (
    <ContactsContext.Provider value={{ contacts, createContact }}>
      {children}
    </ContactsContext.Provider>
  )
}