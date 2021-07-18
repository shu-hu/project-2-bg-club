import mongoose from 'mongoose'

export {
    Reviews
}
const reviewSchema = new mongoose.Schema(
    {
    gameId: Number,
    content: String,
    rating: {type: Number, min: 1, max: 5, default: 5},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, {
    timestamps: true
})

const Reviews = mongoose.model('Reviews', reviewSchema)