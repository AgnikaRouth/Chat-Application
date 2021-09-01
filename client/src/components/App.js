import React  from 'react'
import useLocalStorage from '../hooks/useLocalStorage';
import Login from './Login';
import Dashboard from './Dashboard';
import { ContactsProvider } from '../contexts/ContactsProvider';
import { ConversationsProvider } from '../contexts/ConversationsProvider';
import { SocketProvider } from '../contexts/SocketProvider';

function App() {
  const [id,setId] = useLocalStorage('id')

  const dashboard = (

     <SocketProvider id={id}>
      <ContactsProvider>
        <ConversationsProvider id={id}>
          <Dashboard id={id} />
        </ConversationsProvider>
      </ContactsProvider>
    </SocketProvider>
  )

  return (
    //goes to dashboard if id already exists( if condition is true). else create new id
    //goes out of the login page
    id ? dashboard : <Login onIdSubmit={setId} />
  )
}

export default App;
