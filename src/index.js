const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.body
  const user = users.find(user => user.username === username)
  if (!user) {
    request.user = user
    return next()
  }
  return response.status(400).json({ error: 'User not found.' })
}

app.post('/users', (request, response) => {
  const { name, username } = request.body

  const itUserAlreadyExists = users.some(user => user.username === username)
  if (itUserAlreadyExists) {
    return response.status(400).json({ error: 'Username already exists.' })
  }

  const newUser = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: []
  }
  users.push(newUser)
  return response.status(201).json({ newUser })
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const { username } = request.headers

  if (!username) {
    return response.status(400).json({ error: 'No username found at request headers.' })
  }

  return user.todos
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const { title, deadline } = request.body
  const { username } = request.headers

  if (!username) {
    return response.status(400).json({ error: 'No username found at request headers.' })
  }

  const newTodo = {
    id: uuidv4(),
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
  user.todos.push(newTodo)

  return response.status(201).json({ newTodo })
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const { id } = request.params
  const { title, deadline } = request.body
  const { username } = request.headers

  if (!username) {
    return response.status(400).json({ error: 'No username found at request headers.' })
  }

  const indexOfSelectedTodo = user.todos.indexOf(todo => todo.id === id)
  if (!indexOfSelectedTodo || indexOfSelectedTodo === -1) {
    return response.status(400).json({ error: 'Todo not found at Todos Array.' })
  }
  user.todos[indexOfSelectedTodo].title = title
  user.todos[indexOfSelectedTodo].deadline = deadline

  return response.status(201).send()
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;