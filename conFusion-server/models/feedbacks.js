const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var feedbackSchema = new Schema({
   firstname: {
    type: String,
      required:true
   },
   lastname: {
    type: String,
      default: ''
    },
    telnum:  {
        type: String,
        required: true
    },
    email: {
      type: String,
      required: true

    },
    agree:{
      type:Boolean,
      default:false
    },
    contactType:{
      type: String,
      default:"Email"
    } ,
    message:{
      type:String,
      default:""
    }
}, {
    timestamps: true
});

var Feedbacks = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedbacks;
