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

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride(`_method`))
app.use(morgan(`dev`))

app.get(`/`, async (request, response) => {
    response.render(`index.ejs`)
})

app.listen(3000, () => {
    console.log(`listening on port 3000`)
})