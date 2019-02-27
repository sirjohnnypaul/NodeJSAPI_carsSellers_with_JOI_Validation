const express = require('express');
//const router = express.Router();
const router = require('express-promise-router')();

const UsersController = require('../controllers/users');

//fetch our functions and schemas from route helper
const {validateParam,validateBody, schemas} = require('../helpers/routeHelpers');

//this method of getting routes allows code length minimalization
router.route('/')
    .get(UsersController.index)
    //now if for example body to create new user won't be provided
    //in all fields, but only partialy, it won't allow to validate
    //and throw validation error
    .post(validateBody(schemas.userSchema),UsersController.newUser)

// '/users/:id and we already have /users defined
router.route('/:userId')
    //first validates then executes
    .get(validateParam(schemas.idSchema,'userId'),
        UsersController.getUser)

    .put([validateParam(schemas.idSchema,'userId'),
        validateBody(schemas.userSchema)],
        UsersController.replaceUser)

    .patch([validateParam(schemas.idSchema,'userId'),
        validateBody(schemas.userOptionalSchema)],
        UsersController.updateUser)
    // .delete()

//user cars
router.route('/:userId/cars')
    .get(validateParam(schemas.idSchema, 'userId'),
        UsersController.getUserCars)

    .post([validateParam(schemas.idSchema, 'userId'),
        validateBody(schemas.userCarSchema)],
        UsersController.newUserCar);


module.exports = router;