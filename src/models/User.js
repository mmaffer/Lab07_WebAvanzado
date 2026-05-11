import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    roles: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Role' 
    }],
    name: { 
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    url_profile: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual para calcular la edad
UserSchema.virtual('age').get(function () {
    if (!this.birthdate) return null;
    const today = new Date();
    const birth = new Date(this.birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
});

export default mongoose.model('User', UserSchema);
