const express = require('express');
const { addReview, getReviews } = require('../controllers/reviewController');
const router = express.Router();

router.route('/:id')
    .get(getReviews)
    .post(addReview);

module.exports = router;