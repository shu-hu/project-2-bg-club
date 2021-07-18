import mongoose from 'mongoose'

export {
  User
}

const historySchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    id: Number,
    time: Date,
  },{
    timestamps: true,
  }
)

const userSchema = new mongoose.Schema(
  {
    email: String,
    googleId: String,
    profile: {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
    viewsHistory: [historySchema],
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)
