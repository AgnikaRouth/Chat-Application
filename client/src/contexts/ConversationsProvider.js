import React, { useContext, useState, useCallback, useEffect} from 'react'
import useLocalStorage from '../hooks/useLocalStorage';
import { useContacts } from './ContactsProvider';
import { useSocket } from './SocketProvider';

const ConversationsContext = React.createContext()

// custom hooks to be used in NewConversationModal Component
export function useConversations() {
  return useContext(ConversationsContext)
}

export function ConversationsProvider({ id, children }) { //props to render

   //create state, default is empty array of contacts. Starting with zero contacts 
  const [conversations, setConversations] = useLocalStorage('conversations', [])
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0)
  const { contacts } = useContacts()
  const socket = useSocket()



  //append new contacts at the end of prevContacts
  function createConversation(recipients) { //ids that are selected before
    setConversations(prevConversations => {
      return [...prevConversations, { recipients, messages:[] }] //to display all the previous conversations then add the new messages
    })
  }


  //variable to create and receive mssg from client-server
  const addMessageToConversation = useCallback(({ recipients, text, sender}) =>
  {

      setConversations(prevConversations=>{

        //check if old conversation matches with the current recipients, if not make a new conversation
        let madeChange= false 
        const newMessage = { sender, text }
        const newConversations = prevConversations.map(conversation =>{
          
          //to check if the recipients array match the recipients array of each individual conversation
          if( arrayEquality (conversation.recipients, recipients))
          {
            madeChange = true
            //add new messages to the old list of messages with the same array of recipients
            return {
              ...conversation, messages: [...conversation.messages, newMessage]
            }
          }
          return conversation

        }, [setConversations])


        if(madeChange){
            return newConversations
        }
        else{
          return [
            ...prevConversations,
            { recipients, messages: [newMessage]} //adding new messages if none conversation matched with the already present recipients
          ]
        }
      })



  })

  //call receivemessage from socket in server side

  useEffect(() => {
    if (socket == null) return //if no socket then dont do anything

    socket.on('receive-message', addMessageToConversation)

    return () => socket.off('receive-message') //remove event listener
  }, [socket, addMessageToConversation]) //add dependencies

  //call the message function and assign id to the sender
  //export this in value object

  function sendMessage(recipients, text){
    socket.emit('send-message', {recipients, text}) //send message to different clients
    addMessageToConversation({recipients, text, sender:id })
  }



  //CUSTOM RECIPIENT VARIABLE. for each recipient, there is an id. Convert this to an object that has an id and a name
  //variable to store the name of the recipients
  const formattedConversations = conversations.map((conversation,index) =>{ //mapping over all the recipients for a single conversations
     
        const recipients = conversation.recipients.map(recipient =>{ 
          const contact = contacts.find(contact => {
          return contact.id === recipient //if the id & recipient match, find the contact
      }) 

      const name = (contact && contact.name) || recipient
      return { id: recipient , name} //return object with recipient id and name
      })

      //to see the messages from user-recipients both side
      //variable used in AddMessageToConversation

      const messages = conversation.messages.map (message =>{
         const contact = contacts.find(contact =>{
           return contact.id === message.sender
         }) //check if the message.sender is already saved as contact.id, else set the sender to a new id
         const name = (contact && contact.name) || message.sender

         //check if the message is sent by me
         const fromMe = id === message.sender
         return { ...message, senderName : name ,fromMe }
      })


      const selected = index === selectedConversationIndex
      return { ...conversation, messages, recipients, selected} //display the convo and the new formatted recipient which has an id and a name

  })



  
  //to render out ConversationsProvider and the values in it

  const value ={
    conversations : formattedConversations,
    selectedConversation: formattedConversations[selectedConversationIndex],
    sendMessage,
    selectConversationIndex: setSelectedConversationIndex,
    createConversation

  }

  return (
    <ConversationsContext.Provider value={ value }>
      {children}
    </ConversationsContext.Provider>
  )
}


function arrayEquality(a,b){
  if(a.length !== b.length) return false

  a.sort()
  b.sort()

  return a.every((element, index) => {
    return element === b[index] //check if every element of a is equal to every element of b in the same index
  })
}
