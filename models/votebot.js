const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: String,
	date: Date,
});

module.exports = new mongoose.model('VoteBot', schema);