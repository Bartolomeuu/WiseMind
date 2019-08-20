//importanto 
const express = require('express')
const path = require('path')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

//Caminhos
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use('/', (req, res) => {
    res.send('index.html')
})

//Definindo Variaveis
let sala = ''
let messages = []


//Conexão Socket
io.on('connection', socket => {
    console.log(socket.id)

    //Recebendo dados usuario
    socket.on('sala', data => {
        sala = data
        socket.join(sala);
        console.log(sala)
    })

    //usuario esta digitando...press
    socket.on('typing', (dados) => {
        socket.broadcast.to(dados.sala).emit('renderTyping', dados.user)
    })

    //usuario esta digitando...up
    socket.on('typingUp', (sala) => {
        socket.broadcast.to(sala).emit('noRenderTyping')
    })

    //Enviando mensagem
    socket.on('sendMessage', data => {
        console.log(data)
        messages.push(data)
        socket.broadcast.to(data.sala).emit('receiveMessage', data)
    })
})

//porta do servidor
server.listen(3001)