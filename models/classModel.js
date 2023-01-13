const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    class:{
        type:String,
        required: true
    },
    studentsCount :{
        type:Number,
        required: true
    },
    students:{
        type:Array,
        default:[]
    }
})

const classModel = mongoose.model('class', classSchema);

module.exports = classModel;