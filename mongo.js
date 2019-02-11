const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb://user:${password}@puhelinluettelo-shard-00-00-rgax8.mongodb.net:27017,puhelinluettelo-shard-00-01-rgax8.mongodb.net:27017,puhelinluettelo-shard-00-02-rgax8.mongodb.net:27017/test?ssl=true&replicaSet=Puhelinluettelo-shard-0&authSource=admin&retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 3) {

    const nimi = process.argv[3]
    const numero = process.argv[4]

    const per = new Person({
        name: nimi,
        number: numero,
    })

    console.log(`lisätään ${nimi} numero ${numero} luetteloon`)

    per.save().then(response => {
        console.log('person saved!');
        mongoose.connection.close();
    })

} else {
    Person.find({}).then(result => {
        console.log(`puhelinluettelo:`)
        result.forEach(per => {
            console.log(`${per.name} ${per.number}`)
        })
        mongoose.connection.close()
    }) 
}