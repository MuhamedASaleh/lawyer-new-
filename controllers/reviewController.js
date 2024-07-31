const { where } = require('sequelize');
const { Review } = require('../Associations/associations');
const asyncHandler = require('express-async-handler');

exports.createReview = asyncHandler(async (req, res, next) => {
    const { rating, comment, userID } = req.body;


    // Create the new review
    const newReview = await Review.create({
        rating,
        comment,
        userID // for lawyer 
    });

    // Fetch all reviews
    const reviews = await Review.findAll({ where: { userID } });

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



exports.getAllReview = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    // Fetch all reviews
    const reviews = await Review.findAll({ where: { userID: id } });

    // Calculate the sum of ratings and the count of reviews
    const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
    const countReviews = reviews.length;

    // Calculate the average rating and round up
    const averageRating = Math.ceil(totalRatings / countReviews);

    // Respond with the new review, the number of ratings, the average rating, and the latest review
    res.status(200).json({
        reviews,
        numberOfRatings: countReviews,
        ratingAverage: averageRating
    });;
});

