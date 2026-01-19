const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    name : {type: String, required: true},
    year : {type: String, required: true},
    groups : {type: String, required: true},
    choice : {type : [String]}
});

module.exports = mongoose.model('Subject', SubjectSchema);
