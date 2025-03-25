const dotenv = require(`dotenv`)
dotenv.config()
const express = require(`express`)
const mongoose = require(`mongoose`)
const methodOverride = require(`method-override`)
const morgan = require(`morgan`)
const app = express()

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on (
    `connected`, () => {
        console.log(`connected to mongodb ${mongoose.connection.name}`)
    }
)

const Todos = require(`./models/todos.js`)
const Todo = require("./models/todos.js")
const { name } = require("ejs")

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride(`_method`))
app.use(morgan(`dev`))
app.use(express.static('public'))


app.get(`/`, async (request, response) => {
    const allTodos = await Todo.find()
    response.render(`index.ejs`, {
        todos: allTodos
    })
})

app.post(`/`, async (request, response) => {

    if (request.body.isComplete === `on`) {
        request.body.isComplete = true
    } else {
        request.body.isComplete = false
    }

    await Todo.create(request.body)
    response.redirect(request.get('referer'))
})


app.get(`/todo/:todoId`, async (request, response) => {
    const selectedTodo = await Todo.findById(request.params.todoId)
    response.render(`todoDetails.ejs`, {
        todo: selectedTodo
    })
})


app.put(`/todo/:todoId`, async (request, response) => {
    await Todo.findByIdAndUpdate(request.params.todoId, request.body)
    response.redirect(`/`)
})


app.delete(`/todo/:todoId`, async (request, response) => {
    await Todo.findByIdAndDelete(request.params.todoId)
    response.redirect(`/`)
})


app.listen(3000, () => {
    console.log(`listening on port 3000`)
})