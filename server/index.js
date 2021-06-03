const app = require('express')();
const authRoutes = require('./routes/authRoutes')
app.use(authRoutes)
const http = require('http').createServer(app);
const mongoose =require('mongoose')
const socketio = require('socket.io')
const io = socketio(http);
const mongodb = 'mongodb+srv://veenayadav:PvYuZXtuseCRMfeF@cluster0.8nx3l.mongodb.net/chat-room?retryWrites=true&w=majority'
mongoose.connect(mongodb,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>console.log('connected to database')).catch(err=> console.log(err))
const {addUser, getUser, removeUser} = require('./helper');
const Message = require('./models/Message');
const PORT = process.env.PORT || 5000
const Room = require('./models/Room')

io.on('connection', (socket) => {
    console.log(socket.id);
    Room.find().then(result =>{
        // console.log('output rooms', result)
        socket.emit('output-rooms', result)
    })
    socket.on('create-room', name =>{
        // console.log('Then room name received is', name)
        const room = new Room({name});
        room.save().then(result =>{
            io.emit('room-created', result)
        })
    })
    socket.on('join', ({name, room_id, user_id})=>{
        const {error, user} = addUser({
            socket_id:socket.id,
            name,
            room_id,
            user_id
        })
        socket.join(room_id);
        if(error){
            console.log('join-error')
        }
        else{
            console.log('join user', user)
        }
    })
    socket.on('sendMessage', (message, room_id, callback) => {
        const user = getUser(socket.id);
        const msgToStore = {
            name: user.name,
            user_id: user.user_id,
            room_id,
            text: message
        }
        console.log('message', msgToStore)
        const msg = new Message(msgToStore);
        msg.save().then(result =>{
            io.to(room_id).emit('message', result);
            callback()
        })
    
    })
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
    })
});

http.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});