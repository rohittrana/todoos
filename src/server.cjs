const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 5000;
const DATA_FILE = './todos.json';

app.use(cors());
app.use(express.json());

const readData = () => {
    try {
        const data = fs.existsSync(DATA_FILE) ? fs.readFileSync(DATA_FILE) : '[]';
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading data:", error);
        return [];
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error writing data:", error);
    }
};

// GET - Retrieve all todos
app.get('/todos', (req, res) => {
    const todos = readData();
    res.json(todos);
});

// POST - Add a new todo
app.post('/todos', (req, res) => {
    const todos = readData();
    const newTodo = { id: Date.now(), ...req.body };
    todos.push(newTodo);
    writeData(todos);
    res.status(201).json(newTodo);
});

// PUT - Update a todo by ID
app.put('/todos/:id', (req, res) => {
    const todos = readData();
    const index = todos.findIndex(todo => todo.id === parseInt(req.params.id));
    if (index !== -1) {
        todos[index] = { ...todos[index], ...req.body };
        writeData(todos);
        res.json(todos[index]);
    } else {
        res.status(404).json({ message: "Todo not found" });
    }
});

// DELETE - Delete a todo by ID
app.delete('/todos/:id', (req, res) => {
    const todos = readData();
    const filteredTodos = todos.filter(todo => todo.id !== parseInt(req.params.id));
    writeData(filteredTodos);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
