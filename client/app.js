const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

const socket = io();
socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('join', (userName) => addMessage('Chat Bot', userName + ' has joined the conversation!'));
socket.on('removeUser', (author) => addMessage('Chat Bot', author + ' has left the conversation... :('));

let userName = '';

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);

function login(e) {
    e.preventDefault();
    if(userNameInput.value === '') {
        alert('Type your name');
    } else {
        userName = userNameInput.value;
        socket.emit('join', userName);
        loginForm.classList.remove('show');
        messagesSection.classList.add('show');
    }
}

function sendMessage(e) {
    e.preventDefault();
  
    let messageContent = messageContentInput.value;
  
    if(!messageContent.length) {
      alert('You have to type something!');
    }
    else {
      addMessage(userName, messageContent);
      socket.emit('message', { author: userName, content: messageContent })
      messageContentInput.value = '';
    }
  
}

function addMessage(author, content) {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    if(author === 'Chat Bot'){
        message.style.fontStyle = 'italic';
    }
    if(author === userName) message.classList.add('message--self');
    message.innerHTML = `
      <h3 class="message__author">${userName === author ? 'You' : author }</h3>
      <div class="message__content">
        ${content}
      </div>
    `;
    messagesList.appendChild(message);
  }