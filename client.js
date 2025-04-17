const socket = io('http://localhost:8000');//connects the frontend (HTML/JS) to the backend (Node.js server) using Socket.io.

//Get DOM elements in respective js variables 
const form = document.getElementById('send-container');//Used to detect when the user hits "Send".
const messageInput = document.getElementById('messageInp');//Used to read the message before sending it.
const messageContainer = document.querySelector('.container');// Used to show new messages on the screen.


//Audio that will play on receiving messages 
var audio=new Audio('ting.mp3'); 

// Append message to chat
//Function wch will append event to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');

    if (position === 'notification') {
        messageElement.classList.add('notification');
        messageElement.innerText = message;
    } else {
        messageElement.classList.add('Message');
        messageElement.classList.add(position);
        messageElement.innerText = message;
    }

    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;

    if(position=='left'){
        audio.play();
    }
};

// Prompt for user name
//Asks new user for his/her name  and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// Send message
//if the form get submitted send server the message 
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message !== '') {
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
});

// Events from server
//if the new user joins receive his/her name the from the server 
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'notification');
});

//if a server send a message, receive it 
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

//if the user leaves the chat ,append the information to the container
socket.on('user-left', name => {
    append(`${name} left the chat`, 'notification');
});
