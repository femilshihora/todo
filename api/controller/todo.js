const express = require('express');
const mysqlPool = require('../../config/db');

const addtodo = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) { 
    return res.status(400).json({ success: false, message: 'Please enter title' });
  }

  try {
    const [result] = await mysqlPool.query(
      'INSERT INTO todo (title, description) VALUES (?, ?)',
      [title, description]
    );

    if (result.affectedRows === 0) {
      return res.status(500).json({ success: false, message: 'Todo creation failed' });
    }

    res.status(201).json({ success: true, message: 'Todo created successfully' });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getTodos = async (req, res) => {
  try {
    const [rows] = await mysqlPool.query('SELECT * FROM todo');
    res.status(200).json({ success: true, todos: rows });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getTodoById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Please provide a todo ID' });
  }

  try {
    const [rows] = await mysqlPool.query('SELECT * FROM todo WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    res.status(200).json({ success: true, todo: rows[0] });
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Please provide a todo ID' });
  }

  try {
    const [result] = await mysqlPool.query(
      'UPDATE todo SET title = ?, description = ? WHERE id = ?',
      [title, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    res.status(200).json({ success: true, message: 'Todo updated successfully' });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

const deleteTodo = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Please provide a todo ID' });
  }

  try {
    const [result] = await mysqlPool.query('DELETE FROM todo WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    res.status(200).json({ success: true, message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = {
  addtodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo
};