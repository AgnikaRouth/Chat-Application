const io = require("socket.io")({
    cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
    }
    }).listen(5000)

io.on('connection', socket =>{
    //in order to maintain a static id to the client side, for example, same phone number always
    const id = socket.handshake.query.id //pass this from the client
    socket.join(id) //creates a new id everytime there is a connection

    socket.on('send-message', ({ recipients, text })=>{
        recipients.forEach(recipient  => {
            //in order to swap recipients between sender and receiver
            const newRecipients = recipients.filter(r => r !== recipient) //removing the current recipient from the list of recipients
            newRecipients.push(id) //adding the sender to the list of recipients
            socket.broadcast.to(recipient).emit('receive-message', {
              recipients: newRecipients, sender: id, text 
            }) //similar variables like addMessageToConversation in client side
            
        })
    })
})