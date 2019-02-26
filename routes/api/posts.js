'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Post = require('../../models/Post');
const validatePostInput = require('../../validation/post');
const Profile = require('../../models/Profile');

/* 
@route GET api/posts/test 
@desc TESTS POST ROUTE
@access PUBLIC
*/
router.get('/test', (req, res) => res.json({ msg: 'Posts Works' }));

/* 
@route GET api/posts
@desc GET POSTS
@access PUBLIC
*/
router.get('/', (req, res) => {
	Post.find()
		.sort({ date: -1 })
		.then(posts => res.json(posts))
		.catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
});

/* 
@route GET api/posts/:id
@desc GET POSTS BY ID
@access PUBLIC
*/
router.get('/:id', (req, res) => {
	Post.findById(req.params.id)
		.then(post => res.json(post))
		.catch(err =>
			res.status(404).json({ nopostfound: 'No post found with that ID' })
		);
});

/* 
@route POST api/posts
@desc CREATE NEW POST
@access PRIVATE
*/
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validatePostInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	const newPost = new Post({
		text: req.body.text,
		name: req.body.name,
		avatar: req.body.avatar,
		user: req.user.id
	});

	newPost.save().then(post => res.json(post));
});

/* 
@route DELETE api/posts/:id
@desc DELETE POST
@access PRIVATE
*/
router.delete(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					if (post.user.toString() !== req.user.id) {
						return res.status(401).json({ notauthorized: 'User not authorized' });
					}
					post.remove().then(() => res.json({ success: true }));
				})
				.catch(err => res.status(404).json({ postnotfound: 'No post found' }));
		});
	}
);

/* 
@route POST api/posts/like/:id
@desc LIKE POST
@access PRIVATE
*/
router.post(
	'/like/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					if (
						post.likes.filter(like => like.user.toString() === req.user.id).length >
						0
					) {
						return res
							.status(400)
							.json({ alreadyliked: 'User already liked this post' });
					}
					post.likes.unshift({ user: req.user.id });
					post.save().then(post => res.json(post));
				})
				.catch(err => res.status(404).json({ postnotfound: 'No post found' }));
		});
	}
);

/* 
@route POST api/posts/unlike/:id
@desc UNLIKE POST
@access PRIVATE
*/
router.post(
	'/unlike/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					if (
						post.likes.filter(like => like.user.toString() === req.user.id)
							.length === 0
					) {
						return res
							.status(400)
							.json({ notliked: 'You have not given this post a like' });
					}
					const removeIndex = post.likes
						.map(item => item.user.toString())
						.indexOf(req.user.id);

					post.likes.splice(removeIndex, 1);
					post.save().then(post => res.json(post));
				})
				.catch(err => res.status(404).json({ postnotfound: 'No post found' }));
		});
	}
);

/* 
@route POST api/posts/comment/:id
@desc ADD COMMENT TO POST
@access PRIVATE
*/
router.post(
	'/comment/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const { errors, isValid } = validatePostInput(req.body);

		if (!isValid) {
			return res.status(400).json(errors);
		}

		Post.findById(req.params.id)
			.then(post => {
				const newComment = {
					text: req.body.text,
					name: req.body.name,
					avatar: req.body.avatar,
					user: req.body.id
				};
				post.comments.unshift(newComment);
				post.save().then(post => res.json(post));
			})
			.catch(err => res.status(404).json({ postnotfound: 'No post found' }));
	}
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    REMOVE COMMENT FROM POST
// @access  PRIVATE
router.delete(
	'/comment/:id/:comment_id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Post.findById(req.params.id)
			.then(post => {
				if (
					post.comments.filter(
						comment => comment._id.toString() === req.params.comment_id
					).length === 0
				) {
					return res.status(404).json({ commentnotexist: 'Comment does not exist' });
				}

				const removeIndex = post.comments
					.map(item => item._id.toString())
					.indexOf(req.params.comment_id);

				post.comments.splice(removeIndex, 1);
				post.save().then(post => res.json(post));
			})
			.catch(err => res.status(404).json({ postnotfound: 'No post found' }));
	}
);

module.exports = router;
