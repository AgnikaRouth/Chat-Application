import React, { useState } from 'react'
import { Form, Modal, Button } from 'react-bootstrap'
import { useContacts } from '../contexts/ContactsProvider'
import { useConversations } from '../contexts/ConversationsProvider'

export default function NewConversationModal({closeModal}){

    const [selectedContactIds, setSelectedContactsIds] = useState([])
    const {contacts} = useContacts()
    const { createConversation } = useConversations()

    function handleSubmit(e) {
        e.preventDefault()
    
        createConversation(selectedContactIds) //from ConversationsProvider
        closeModal() //props
    }

    function handleCheckboxChange(contactId) {
        setSelectedContactsIds(prevSelectedContactIds => {
            //check if the id is already saved in thelist
          if (prevSelectedContactIds.includes(contactId)) {
              //return a new list which doesn't have the new id
            return prevSelectedContactIds.filter(prevId => {
              return contactId !== prevId //remove all the ids which is similar to previd
            })
          } else {
            return [...prevSelectedContactIds, contactId] //append at the end of the contactid list
          }
        })
    }

    return( 
        <>
         <Modal.Header closeButton>
            Create Conversation
         </Modal.Header>
         <Modal.Body>
         <Form onSubmit={handleSubmit}>
          {contacts.map(contact => ( //get the contacts from ContactsProvider
            <Form.Group controlId={contact.id} key={contact.id}>
              <Form.Check
                type="checkbox"
                //value as a state
                value={selectedContactIds.includes(contact.id)} //if it includes CURRENT contact.id
                label={contact.name}
                onChange={() => handleCheckboxChange(contact.id)}
              />
            </Form.Group>
          ))}
          <Button type="submit">Create</Button>
        </Form>
         </Modal.Body>
        </>
     )
}