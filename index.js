const express = require('express')
const morgan = require('morgan')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(morgan('tiny'))
app.use(bodyParser.json())
app.use(cors())

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "045-1236543"
    },
    {
        id: 2,
        name: "Arto Järvinen",
        number: "041-21423123"
    },
    {
        id: 3,
        name: "Lea Kutvonen",
        number: "040-4323234"
    },
    {
        id: 4,
        name: "Martti Tienari",
        number: "09-784232"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`<div>
        <p>Puhelinluettelossa ${persons.length} henkilön tiedot</p><br>
        <p>${new Date()}</p>
    </div>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const per = persons.find(pers => pers.id === id)
    res.json(per)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(per => per.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (body.name === undefined) {
        return res.status(400).json({
            error: 'name missing'
        })
    }

    if (persons.map(per => per.name).includes(body.name)) {
        return res.status(400).json( {
            error: 'name already exists'
        })
    }

    const per = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * Math.floor(10000))
    }

    persons = persons.concat(per)
    res.json(per)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server runnings on port ${PORT}`)
})