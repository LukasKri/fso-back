require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const {
    errorHandlingMiddleware,
    unknownUrlMiddleware,
} = require('./middleware')

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('body', (req) => {
    if (req.method === 'POST') {
    // do not log an ID
        const { name, number } = req.body
        return JSON.stringify({ name, number })
    }
})

app.use(morgan(':method :url :status - :response-time ms :body'))

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    Person.find({}).then((persons) => {
        const data = `
    <div>Phonebook has info for ${persons.length} people</div>
    <br/>
    <div>${new Date()}</div>
  `

        response.send(data)
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then((persons) => {
        response.json(persons)
    })
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    const name = body.name.trim()
    const number = body.number.trim()
    if (!name) {
        response.status(400).send({ error: 'name must be provided' })
        return
    }

    if (!number) {
        response.status(400).send({ error: 'number must be provided' })
        return
    }

    const person = new Person({
        name,
        number,
    })

    person
        .save()
        .then((savedPerson) => {
            response.json(savedPerson)
        })
        .catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then((person) => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const paramsId = request.params.id

    Person.findByIdAndRemove(paramsId)
        .then(() => {
            response.status(204).end()
        })
        .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const paramsId = request.params.id
    const { name, number } = request.body

    Person.findByIdAndUpdate(
        paramsId,
        { name, number },
        {
            new: true,
            runValidators: true,
            context: 'query',
        }
    )
        .then((person) => response.status(200).send(person))
        .catch((error) => next(error))
})

app.use(unknownUrlMiddleware)

app.use(errorHandlingMiddleware)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
