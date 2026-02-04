const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    pseudo : { type: String, required: true, unique: true },
    password: { type: String, required: true },
    preferences: {
        formation: {type: String},
        subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }]
    }
});

module.exports = mongoose.model('User', UserSchema);
