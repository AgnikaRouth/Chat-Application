import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { useContacts } from '../contexts/ContactsProvider'

export default function Contacts()
{   
    const { contacts } = useContacts()

    return (
        <ListGroup variant="flush"> {/* flush to remove borders and rounded corner, like cards  */}
          {contacts.map(contact => (
            <ListGroup.Item key={contact.id}>
              {contact.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
    )
}
