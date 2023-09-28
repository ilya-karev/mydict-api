const mongoose = require('mongoose');

const translateSchema = mongoose.Schema({
  languageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Language'},
  spelling: { type: String, required: true }
})

const wordSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    defaultName: translateSchema,
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    languages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Language' }],
    translates: [translateSchema]
});

export default mongoose.model('Word', wordSchema);
