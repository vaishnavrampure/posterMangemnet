import mongoose from "mongoose";

const clientSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        campaigns: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Campaign',
            }
        ],
        active: {
            type: Boolean,
            required: true,
            default: true, 
        },
        contactInfo: {
            fullName: {
                type: String,
            },
            email: {
                type: String,
                match: [/.+@.+\..+/, 'Please enter a valid email address'],
            },
            phone: {
                type: String,
                match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
            },
        },
        address: {
            street: {
                type: String,
            },
            city: {
                type: String,
            },
            state: {
                type: String,
            },
            zipCode: {
                type: String,
                match: [/^\d{5}$/, 'Please enter a valid 5-digit zip code'],
            },
        },
        size: {
            type: Number,
            
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

const Client = mongoose.model('Client', clientSchema);

export default Client;
