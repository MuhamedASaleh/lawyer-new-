const Review = require('../models/reviewModel');
const asyncHandler = require('express-async-handler');

exports.createReview = asyncHandler(async (req, res, next) => {
    const { rating, comment } = req.body;

    // Create the new review
    const newReview = await Review.create({
        rating,
        comment
    });

    // Fetch all reviews
    const reviews = await Review.findAll({
        order: [['createdAt', 'DESC']] // Ensure reviews are ordered by creation date
    });

    // Calculate the sum of ratings and the count of reviews
    const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
    const countReviews = reviews.length;

    // Calculate the average rating and round up
    const averageRating = Math.ceil(totalRatings / countReviews);

    // Respond with the new review, the number of ratings, the average rating, and the latest review
    res.status(200).json({
        newReview,
        numberOfRatings: countReviews,
        ratingAverage: averageRating
    });
});



// exports.getAllReview = asyncHandler(async (req, res, next) => {

//     const reviews = await Review.findAll();
//     res.status(200).json({ data: reviews });
// });

// exports.updateReview = asyncHandler(async (req, res, next) => {
//     const { id } = req.params;
//     const review = await Review.findByPk(id);

//     if (!review) {
//         throw new Api404Error('review not found')
//     }
//     const { rating, comment } = req.body;

//     blog.rating = rating || blog.rating;
//     blog.comment = comment || blog.comment
//     await blog.save();

//     res.status(200).json({ data: blog })
// }
// )