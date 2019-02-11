if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const morgan = require('morgan')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const Person = require('./models/person')

app.use(morgan('tiny'))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

let persons = []

app.get('/api/persons', (req, res) => {
    Person.find({}).then(pers => {
        persons = pers
        res.json(pers.map(per => per.toJSON()))
    })
})

app.get('/info', (req, res) => {
    res.send(`<div>
        <p>Puhelinluettelossa ${persons.length} henkilön tiedot</p><br>
        <p>${new Date()}</p>
    </div>`)
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(per => {
        res.json(per.toJSON())
    })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id).then(result => {
        res.status(204).end()
    })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const per = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, per, { new: true }).then(updatedPer => {
        res.json(updatedPer.toJSON())
    })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body
    const per = new Person({
        name: body.name,
        number: body.number
    })

    per.save().then(savedPer => {
        res.json(savedPer.toJSON())
    })
        .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return res.status(400).send({ error: 'vääränlainen id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).send({ error: 'Annettu nimi ei kelpaa tai se on jo käytössä' })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server runnings on port ${PORT}`)
})