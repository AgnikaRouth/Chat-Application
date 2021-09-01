import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider'


export default function Conversations()
{

    const { conversations, selectConversationIndex } = useConversations()
    return (
        <ListGroup variant="flush"> {/* flush to remove borders and rounded corner, like cards  */}
          {conversations.map((conversation, index) => (
            <ListGroup.Item
                key={index} 
                action
                onClick={() => selectConversationIndex (index)}
                active={conversation.selected}>
                    {conversation.recipients.map (r => r.name).join(',')} {/*display the list of recipients by their name from ConversationProvider*/}
            </ListGroup.Item>
          ))}
        </ListGroup>
    )
}
