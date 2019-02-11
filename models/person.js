const mongoose = require('mongoose')
const uniVal = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)
const url = process.env.MONGODB_URI

console.log('connecting...')

mongoose.connect(url, { useNewUrlParser: true })
    .then(result => {
        console.log('connected to DB')
    })
    .catch((error) => {
        console.log('error:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    number: {
        type: String,
        required: true
    }
})
personSchema.plugin(uniVal)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)