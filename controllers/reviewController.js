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
    const { page = 1, limit = 10 } = req.query;

    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Validate page and limit
    if (isNaN(pageNumber) || pageNumber <= 0) {
        return res.status(400).json({ error: 'Invalid page parameter' });
    }

    if (isNaN(limitNumber) || limitNumber <= 0) {
        return res.status(400).json({ error: 'Invalid limit parameter' });
    }

    // Calculate offset
    const offset = (pageNumber - 1) * limitNumber;

    // Fetch reviews with pagination
    const { rows: reviews, count: totalReviews } = await Review.findAndCountAll({
        where: { userID: id },
        limit: limitNumber,
        offset,
    });

    // Calculate the sum of ratings and the count of reviews
    const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
    const countReviews = reviews.length;

    // Calculate the average rating and round up
    const averageRating = countReviews ? Math.ceil(totalRatings / countReviews) : 0;

    // Respond with the reviews, the number of ratings, the average rating, and pagination info
    res.status(200).json({
        reviews,
        numberOfRatings: totalReviews,
        ratingAverage: averageRating,
        totalPages: Math.ceil(totalReviews / limitNumber),
        currentPage: pageNumber,
        limit: limitNumber
    });
});