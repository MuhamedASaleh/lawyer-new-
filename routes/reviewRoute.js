const router = require('express').Router()
const reviewController = require('../controllers/reviewController');
const validate = require('../middleware/validateRequest')
const { createReviewSchema } = require('../Validations/reviewValidator')
router.post('/review', reviewController.createReview);

// Get all news
router.post('/review', validate(createReviewSchema), reviewController.createReview);
// router.get('/review', reviewController.getAllReview);

module.exports = router;
