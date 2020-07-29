const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const Schema = mongoose.Schema;

var favouriteSchema = new Schema({
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    dish:[
      {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dish'
    }
  ]
},{
    timestamps: true
});


var Favourites = mongoose.model('Favourite', favouriteSchema);

module.exports = Favourites;
