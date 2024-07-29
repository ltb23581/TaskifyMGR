const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    role: { type: String, default: 'Member' } // Role can be defined as required if needed
})

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    phone: {
        type: String,
        default: '706444442'
        //required: true,
        //unique: true,
        //trim: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    profile_picture: {
        type: String,
        default: 'https://htmlcolorcodes.com/assets/images/colors/gray-color-solid-background-1920x1080.png'
    },
    members: [MemberSchema],
    created_date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = User = mongoose.model('user', UserSchema);