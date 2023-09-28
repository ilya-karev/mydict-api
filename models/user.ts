const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /^[A-Za-z0-9+_.-]+@(.+)$/
    },
    password: { type: String, required: true }
});

export default mongoose.model('User', userSchema);
