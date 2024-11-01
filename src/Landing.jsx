import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function Landing() {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        // Fetch todos from backend on component mount
        const fetchTodos = async () => {
            const response = await fetch('http://localhost:5000/todos');
            const data = await response.json();
            setTodos(data);
        };
        fetchTodos();
    }, []);

    const handleAddTodo = async () => {
        const newTodo = { title, description };
        const response = await fetch('http://localhost:5000/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTodo)
        });
        const addedTodo = await response.json();
        setTodos([...todos, addedTodo]);
        setTitle('');
        setDescription('');
    };

    const handleDeleteTodo = async (id) => {
        await fetch(`http://localhost:5000/todos/${id}`, { method: 'DELETE' });
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const handleUpdateTodo = async (id) => {
        const updatedTitle = prompt('Enter new title:', title);
        const updatedDescription = prompt('Enter new description:', description);
        if (updatedTitle && updatedDescription) {
            const updatedTodo = { title: updatedTitle, description: updatedDescription };
            const response = await fetch(`http://localhost:5000/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTodo)
            });
            const data = await response.json();
            setTodos(todos.map(todo => (todo.id === id ? data : todo)));
        }
    };

    return (
        <div style={{
            background: "linear-gradient(to right, #f9f7f7, #dbe2ef)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            padding: "20px",
        }}>
          
            <Card style={{ minWidth: 300, padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                <CardContent>
                    <Typography variant="h5" style={{ color: '#112d4e', fontWeight: 'bold', marginBottom: '20px' }}>
                        Todo List
                    </Typography>
                    <TextField
                        label="Title"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </CardContent>
                <CardActions>
                    <Button onClick={handleAddTodo} variant="contained" color="primary" fullWidth>
                        Add Todo
                    </Button>
                </CardActions>
                <CardContent>
                    {todos.map((todo) => (
                        <Card key={todo.id} style={{ marginBottom: '10px', padding: '10px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
                            <Typography variant="subtitle1" style={{ fontWeight: 'bold', color: '#3f72af' }}>
                                {todo.title}
                            </Typography>
                            <Typography variant="body2" style={{ color: '#112d4e', marginBottom: '10px' }}>
                                {todo.description}
                            </Typography>
                            <Button onClick={() => handleUpdateTodo(todo.id)} size="small" color="secondary">
                                Edit
                            </Button>
                            <Button onClick={() => handleDeleteTodo(todo.id)} size="small" color="error">
                                Delete
                            </Button>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

export default Landing;
