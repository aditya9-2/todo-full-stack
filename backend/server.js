const { error } = require('console');
const express = require('express');
const fs = require('fs');
const PORT = 3000;

const app = express();

app.use(express.json());

const filePath = './data/todo.json';

app.get('/todos', (req, res) => {

    fs.readFile(filePath, 'utf-8', (err, data) => {

        if (err) {

            console.log('Error reading file:', err);
            return res.status(400).send(`An error occurred while processing your request`);

        }
        const todos = JSON.parse(data);
        res.status(200).send(todos);
    });
});

app.post('/todos', (req, res) => {

    fs.readFile(filePath, 'utf-8', (err, data) => {

        if (err) {

            console.log('Error reading file:', err);
            return res.status(400).send(`An error occurred while processing your request`);

        }


        const todos = JSON.parse(data);

        const date = Date.now();
        let generatedId = date.toString().slice(-4);

        const newTodo = {
            id: generatedId,
            ...req.body
        };

        todos.push(newTodo)


        fs.writeFile(filePath, JSON.stringify(todos, null, 2), (err) => {
            if (err) {
                console.log(`unable to add data in the file: ${err}`);
                return res.status(500).send('An error occured while adding the todo')
            }

            res.status(201).send({
                success: "todo added succefully",
                todo: newTodo
            });
        });
    });
});

app.put('/todos/:id', (req, res) => {
    const targetId = req.params.id;
    fs.readFile(filePath, 'utf-8', (err, data) => {

        if (err) {

            console.log('Error reading file:', err);
            return res.status(400).send(`An error occurred while processing your request`);

        }
        const todos = JSON.parse(data);

        let foundTodo = null;
        let todoIndex = -1;

        todos.forEach((todo, index) => {

            if (todo.id === targetId) {
                foundTodo = todo;
                todoIndex = index;
            }
        });

        if (foundTodo === null) {
            return res.status(404).send("Todo Not found");
        }

        Object.assign(foundTodo, req.body);

        todos[todoIndex] = foundTodo;

        fs.writeFile(filePath, JSON.stringify(todos, null, 2), (err) => {
            if (err) {
                console.log('Error writing file:', err);
                return res.status(500).send('An error occurred while updating the todo');

            }
            res.status(200).send({
                success: "Todo updated Succesfully",
                todo: foundTodo
            })
        })
    });
});

app.delete('/todos/:id', (req, res) => {

});

app.listen(PORT, () => {
    console.log(`server up! http://localhost/${PORT}`);

})