const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    link : { type : String , required : true },
    Module_name : { type : String , required : true}
},
{
    collection : 'notes'
})

const model = mongoose.model('schema',schema)
module.exports = model
