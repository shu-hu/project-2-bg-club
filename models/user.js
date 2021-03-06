import mongoose from 'mongoose'

export {
  User
}

const historySchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    gameId: Number,
  },{
    timestamps: true,
  }
)

const favoriteSchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    gameId: Number,
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
    favorite: [favoriteSchema],
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)
