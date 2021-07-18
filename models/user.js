import mongoose from 'mongoose'

export {
  User
}

const historySchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    gameId: {type: Number, unique: true},
  },{
    timestamps: true,
  }
)

const reviewSchema = new Schema({
  content: String,
  rating: {type: Number, min: 1, max: 5, default: 5}
}, {
  timestamps: true
})

const favoriteSchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    gameId: {type: Number, unique: true},
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
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)
