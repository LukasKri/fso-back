const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose
    .connect(url)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
    },
    number: {
        type: String,
        required: true,
        min: 8,
        validate: {
            validator: function(num) {
                return /^[0-9]{2,3}-[0-9]{6,}|^\d{8,}/.test(num)
            },
            message: props => `${props.value} is not a valid phone number!`
        },
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

module.exports = mongoose.model('Person', personSchema)
