const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const usersController = require('../controllers/users');

router.get('/', usersController.getAllUsers);

router.post(
  '/',
  [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('favoriteColor').notEmpty().withMessage('Favorite color is required'),
    body('birthday').isISO8601().withMessage('Invalid birthday format'),
    body('favoriteGenre').notEmpty().withMessage('Favorite genre is required'),
    body('favoriteAuthor').notEmpty().withMessage('Favorite author is required')
  ],
  usersController.createUser
);

router.get('/:id', usersController.getUserById);

router.put(
  '/:id',
  [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('favoriteColor').notEmpty().withMessage('Favorite color is required'),
    body('birthday').isISO8601().withMessage('Invalid birthday format'),
    body('favoriteGenre').notEmpty().withMessage('Favorite genre is required'),
    body('favoriteAuthor').notEmpty().withMessage('Favorite author is required')
  ],
  usersController.updateUserById
);

router.delete('/:id', usersController.deleteUserById);

module.exports = router;