import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  createdAt: Date
  chatHistory: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>
}

const ChatMessageSchema = new Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
})

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Numele este obligatoriu'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email-ul este obligatoriu'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Parola este obligatorie'],
      minlength: 6,
    },
    chatHistory: [ChatMessageSchema],
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
