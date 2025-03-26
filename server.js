const dotenv = require(`dotenv`)
dotenv.config()
const express = require(`express`)
const mongoose = require(`mongoose`)
const methodOverride = require(`method-override`)
const morgan = require(`morgan`)
const app = express()

const Todos = require(`./models/todos.js`)
const Todo = require("./models/todos.js")
const { name } = require("ejs")

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride(`_method`))
app.use(morgan(`dev`))
app.use(express.static('public'))




// Connect to Databse
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on(
    `connected`, () => {
        console.log(`connected to mongodb ${mongoose.connection.name}`)
    }
)




// Display all items
app.get(`/`, async (request, response) => {
    const allTodos = await Todo.find()
    response.render(`index.ejs`, {
        todos: allTodos
    })
})




// Create
app.post(`/`, async (request, response) => {

    if (request.body.isComplete === `on`) {
        request.body.isComplete = true
    } else {
        request.body.isComplete = false
    }

    await Todo.create(request.body)
    response.redirect(request.get('referer'))
})




// Read
app.get(`/todo/:todoId`, async (request, response) => {
    const selectedTodo = await Todo.findById(request.params.todoId)
    response.render(`todoDetails.ejs`, {
        todo: selectedTodo
    })
})




// Update
app.put(`/todo/:todoId`, async (request, response) => {
    await Todo.findByIdAndUpdate(request.params.todoId, request.body)
    response.redirect(`/`)
})




// Update checkmarks
// app.put("/:todoId", async (request, response) => {
//     console.log(request.body)
//     let userChecked = false
//     if (request.body.isComplete === `on`) {
//         userChecked = true
//     }

//     await Todo.findByIdAndUpdate(request.params.todoId, { isComplete: userChecked });

//     response.redirect("/");
// });

app.put("/:todoId", async (request, response) => {
    try {
        // Determine if the checkbox was checked or unchecked
        const isComplete = request.body.isComplete === "on"; // "on" means checked

        // Update the todo in the database
        await Todo.findByIdAndUpdate(request.params.todoId, { isComplete });

        response.redirect("/");
    } catch (error) {
        console.error("Error updating todo:", error);
        response.status(500).send("Internal Server Error");
    }
});




// Delete
app.delete(`/todo/:todoId`, async (request, response) => {
    await Todo.findByIdAndDelete(request.params.todoId)
    response.redirect(`/`)
})




app.listen(3000, () => {
    console.log(`listening on port 3000`)
})