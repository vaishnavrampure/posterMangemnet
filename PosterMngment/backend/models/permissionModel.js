import mongoose from 'mongoose';

const permissionSchema = mongoose.Schema({
    name: {
        type:String,
        required: true,
        unique:true,
    },
    description: {
        type: String,
      },
    }, {
      timestamps: true,
    });
    
const Permissions = mongoose.model('Permission', permissionSchema);

export default Permissions;
