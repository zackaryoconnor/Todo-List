const mongoose = require(`mongoose`)

const todosSchema = new mongoose.Schema({
    item: String,
    isComplete: Boolean
})

const Todo = mongoose.model(`Todo`, todosSchema)

module.exports = Todo