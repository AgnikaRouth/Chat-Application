//import { Button } from 'bootstrap'
import React, {useRef} from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import { v4 as uuidV4 } from 'uuid'

export default function Login({ onIdSubmit })
{
    const idRef = useRef()

    function handleSubmit(e){
        e.preventDefault() //will not refresh the page on submit
        
        onIdSubmit(idRef.current.value)
    }

    function createNewId()
    {
        onIdSubmit(uuidV4())
    }

    return (
        <Container className ="align-items-center d-flex" style={{ height: '100vh'}}>
            <Form onSubmit={handleSubmit}className ="w-100">
                <Form.Group>
                    <Form.Label> Enter your ID</Form.Label>
                    <Form.Control type="text" ref={idRef} required>
                    </Form.Control>
                </Form.Group>

                <Button type="submit" className="btn mr-5 mt-3"> Login </Button>   {" "}
                <Button onClick={createNewId} variant="secondary" className = "btn mt-3 ml-3"> Create a new ID </Button>
            </Form>

        </Container>
             
       
    )
}