const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    pseudo : { type: String, required: true, unique: true },
    password: { type: String, required: true },
    preferences: {
        group: {type: String},
        options: [String]
    }
});

module.exports = mongoose.model('User', UserSchema);
