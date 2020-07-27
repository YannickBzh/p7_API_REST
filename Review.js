const reviewAdapter = review => ({
    stars: review.rating,
    comment: review.text
})