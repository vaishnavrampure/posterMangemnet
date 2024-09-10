import mongoose from 'mongoose';

const campaignSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['In Progress', 'Completed', 'Paused'],
        default: 'In Progress'
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }],
    assignedContractors: [{
        type: String,
        required: true
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    completionDate: {
        type: Date
    },
    lastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lastModifiedDate: {
        type: Date,
        default: Date.now
    },
    clientName: { 
        type: String,
        required: true,
    },
    active: {
        type: Boolean, 
        required: true,
    },
    city: {
        type: String,
    },
    neighborhood: {
        type: String,
    },
    postersOrContacts: {
        type: Number,
    },
    type: {
        type: String,
        enum: ['Poster', 'Street Work', 'Flyers', 'Pop-up'],
    },
    quotedRate: {
        type: Number,
    }
}, {
    timestamps: true
});

const Campaign = mongoose.model('Campaign', campaignSchema);

export default Campaign;
