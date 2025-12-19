import mongoose ,{Schema,Document} from 'mongoose';

export interface Message extends Document {
    Content: string;
    Date: Date;
}
const MessageSchema: Schema<Message> = new Schema({
    Content: { 
        type: String, 
        required: true },
    Date: { 
        type: Date, 
        required: true,
        default: Date.now
    }
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpire: Date;
    isverified: boolean;
    isAcceptingMessage: boolean;
    Messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: { 
        type: String,
        required: [true, 'Username is required'],
        unique: true 
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: { 
        type: String,
        required: [true, 'Password is required']
    },
    verifyCode: {
        type: String,
        required: [true, 'Verify code is required']
    },
    verifyCodeExpire: {
        type: Date,
        required: [true, 'Verify code expiry is required']
    },
    isverified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        required: true,
        default: true
    },
    Messages: {
        type: [MessageSchema],
        required: true,
        default: []
    }
});
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);
export default UserModel;