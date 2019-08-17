const express = require('express')
const path = require('path')





const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)


app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use('/', (req, res) => {
    res.send('index.html')
})


let sala = ''
let messages = []

io.on('connection', socket => {
    console.log(socket.id)


    socket.on('sala', data => {
        sala = data
        socket.join(sala);
        console.log(sala)
    })

    socket.on('typing', () => {
        socket.broadcast.emit('renderTyping', socket.id)
    })


    socket.on('sendMessage', data => {
        console.log(data)
        messages.push(data)
        socket.broadcast.to(data.sala).emit('receiveMessage', data)
        

    })
})


server.listen(3001)