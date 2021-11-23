const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userid: String,
	currency: {type: Number, default: 0},
});

module.exports = new mongoose.model('Users', schema);