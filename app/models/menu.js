const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  titre: String,
  plat : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plat'
  }],
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: Boolean,
},
  {
    timestamps: true
})

module.exports = mongoose.model('Menu', MenuSchema);

