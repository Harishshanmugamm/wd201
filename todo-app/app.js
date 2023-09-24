const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path= require('path')
app.use(bodyParser.json());

app.set("view engine", "ejs" )

app.get("/", async (request, response) =>{
  const allTodos= await Todo.getTodo();
  if(request.accepts("html")){
    response.render('index',{allTodos});
  }
  else{
    response.json({allTodos})
  }
  //response.send("Hello World ");
  //response.render('index');
});

app.use(express.static(path.join(__dirname,'public')))

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  // FILL IN YOUR CODE HERE

  // First, we have to query our PostgerSQL database using Sequelize to get list of all Todos.
  // Then, we have to respond with all Todos, like:
  // response.send(todos)

  try {

    let todo = await Todo.findAll();
    return response.send(todo);
  } 
  catch (error)
   {
    console.log(error);
    return response.status(422).json(error);
  }
   });

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    const todo = await Todo.addTodo(request.body);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
 
  let dt = await Todo.destroy({where: { id:request.params.id } })
  response.send(dt ?true :false)
});

module.exports = app;
