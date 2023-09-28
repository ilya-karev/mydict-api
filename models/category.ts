const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    wordId: { type: mongoose.Schema.Types.ObjectId, ref: 'Word' },
});

export default mongoose.model('Category', categorySchema);
