const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (email) {
                const emailRegex = /^[a-z][a-z0-9]*@[a-z]+\.[a-z]+$/;
                const isValidFormat = emailRegex.test(email);
                const isValidSize = Buffer.byteLength(email, 'utf-8') <= 102 * 1024;
                return isValidFormat && isValidSize;
            },
            message:
                "Invalid email. Must start with a lowercase letter, include numbers, and be a valid format. Size limit: 102 KB",
        },
    },
    password: {
        type: String,
        required: true,
        
    }
});
const UserModel = mongoose.model('users',UserSchema);
module.exports = UserModel;
