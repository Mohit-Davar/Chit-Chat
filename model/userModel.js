const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

// Schema
const userSchema = new mongoose.Schema({
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profile: {
        status: {
            type: String,
            default: 'Hey there!'
        },
        profileImg: {
            type: String,
            default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZI3WfV6fNLFMTOZ4BZZkaPXWYsqQygwzqaA&s'
        }
    },
    contacts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, { timestamps: true });
// Encrypting The password
userSchema.pre('save', async function (next) {
    const Person = this;
    // Hash The Password only if it is new or it has been modified
    if (!Person.isModified("password")) {
        return next();
    }
    // Hashing The Password
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Person.password, salt);
        Person.password = hashedPassword;
        return next();
    } catch (err) {
        return next(err);
    }
});
// Decrypting and Checking the password
userSchema.methods.comparePassword = async function (candidatePassword) {
    const Person = this;
    try {
        const isMatch = await bcrypt.compare(candidatePassword, Person.password)
        return isMatch
    } catch (err) {
        throw new Error(err)
    }
}
const User = mongoose.model("User", userSchema);
module.exports = User;
