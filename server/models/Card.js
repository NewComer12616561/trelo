const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    dueDate: Date,
    assignee: String,
    boardId: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        default: 'Medium'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Card', cardSchema);