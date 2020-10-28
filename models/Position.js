const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const positionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categoryes',
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
});

module.exports = mongoose.model('positions', positionSchema);
