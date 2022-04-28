const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const leaderSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        default: ''
    },
    description:{
       type:String,
       requires:true
    },

    featured: {
        type: Boolean,
        default:false
    }
},{
    timestamps: true
});

var leaders = mongoose.model('leader', leaderSchema);

module.exports = leaders;