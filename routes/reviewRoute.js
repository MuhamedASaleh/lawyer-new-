const router = require('express').Router()
const reviewController = require('../controllers/reviewController');
const validate = require('../middleware/validateRequest')
const { createReviewSchema } = require('../Validations/reviewValidator')

const {Auth , AuthorizeRole} = require('../middleware/auth')



router.post('/review', reviewController.createReview);


router.get('/review/:id' ,  reviewController.getAllReview);

module.exports = router; 
