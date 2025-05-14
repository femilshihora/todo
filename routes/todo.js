const express = require('express');

const mysqlPool = require('../config/db');
const todorouter = express.Router();
const { addtodo, getTodos, getTodoById, updateTodo, deleteTodo } = require('../api/controller/todo');



todorouter.post('/addtodo', addtodo);
todorouter.get('/gettodos', getTodos);
todorouter.get('/gettodo/:id', getTodoById);
todorouter.put('/updatetodo/:id', updateTodo);
todorouter.delete('/deletetodo/:id', deleteTodo);

module.exports = todorouter;