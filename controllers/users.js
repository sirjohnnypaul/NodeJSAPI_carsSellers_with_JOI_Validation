const User = require('../models/user');
const Car = require('../models/car');

module.exports = {

    //calback version
    // index: (req, res, next) => {
    //     User.find({}, (err, users) => {
    //         if(err) {
    //             next(err);
    //         }
    //         res.status(200).json(users);
    //     });
    //     // res.status(200).json({
    //     //     message: 'Requested index page'
    //     // }); 
    // },

    //Promises version
    // index: (req, res, next) => {
    //     //if this finishes
    //     User.find({})
    //     //do this
    //     .then(users => {
    //         res.status(200).json(users);
    //     })
    //     .catch(err => {
    //         next(err);
    //     });
    // },

    //Async Await Version
    // index: async (req,res,next) => {
    //     //awaiting is waiting for User.find to execute and it's saving it to users variable
    //     try {
    //         const users = await User.find({});
    //         res.status(200).json(users);
    //     } 
    //     catch(err) {
    //         next(err);
    //     }
    // },

    //Thanks to replacing standard express router with express-promise-router, which contains error handling on it's own
    //Last Version Looks Like That
    index: async (req,res,next) => {
        const users = await User.find({});
        res.status(200).json(users);
    },


    //calback version
    // newUser: (req, res, next) => {
    //     console.log('req.body contents', req.body);
    //     const newUser = new User(req.body);
    //     console.log('newUser', newUser);
    //     newUser.save((err, user) => {
    //         if(err) {
    //             next(err);
    //         }
    //         console.log('err',err);
    //         console.log('user', user);
    //         res.status(201).json(user);
    //     });
    // },

    //Promises version
    // newUser: (req, res, next) => {
    //     const newUser = new User(req.body);
    //     newUser.save()
    //     .then(user => {
    //         res.status(201).json(user);
    //     })
    //     .catch(err => {
    //         next(err);
    //     })
    // },

    //Async Await Version
    // newUser: async (req,res, next) => {
    //     try {
    //         const newUser = new User(req.body);
    //         const user = await newUser.save();
    //         res.status(201).json(user);
    //     }
    //     catch(err) {
    //         next(err);
    //     }
    // },


    //Thanks to replacing standard express router with express-promise-router, which contains error handling on it's own
    //Last Version Looks Like That
    newUser: async (req,res, next) => {
        //console.log('req.value: ',req.value);
        //we are using validation so if it was validated we
        //want to use req.value defined during validation
        const newUser = new User(req.value.body);
        //const newUser = new User(req.body);
        const user = await newUser.save();
        res.status(201).json(user);
    },

    getUser: async (req,res,next) => {
        //console.log(req.params.userId)
        //const userId = req.params.userId; //Not ES6 version
        //const {userId} = req.params; //ES6 version
        //but we know it passed our validation before executing so
        //we capture our validation value object defined in 
        const {userId} = req.value.params; 
        const user = await User.findById(userId);
        res.status(200).json(user);
    },

    //replace needs validation if all fields defined in model are
    //provided, cause replace neeeds all element to replace, overwrite 
    //old object
    replaceUser: async (req,res,next) => {
        //const {userId} = req.params; //ES6 version
        //we use validation so again we use defined value
        const {userId} = req.value.params;
        //const newUser = req.body;
        const newUser = req.value.body; //also taken from defined value in validation
        const result = await User.findByIdAndUpdate(userId,newUser);
        //console.log(result);
        res.status(200).json({success:true});
        //console.log(userId);
        //console.log(newUser);
    },

    //update does not need validation for all fields because
    //we can simply update anything in parts, like one letter
    //or one param
    updateUser: async (req,res,next) => {
        //const {userId} = req.params; //ES6 version
        //we use validation so again we use defined value
        const {userId} = req.value.params;
        //const newUser = req.body;
        const newUser = req.value.body; //also taken from defined value in validation
        const result = await User.findByIdAndUpdate(userId,newUser);
        res.status(200).json({success:true});
    },

    getUserCars: async (req,res,next) => {
        const {userId} = req.params;
        const user = await User.findById(userId).populate('cars');
        //console.log('user\'s car',user.cars);
        //console.log('user\'s cars',user);
        res.status(200).json(user.cars);
    },

    newUserCar: async (req,res,next) => {
        //const {userId} = req.params;
        //we use validation so again we use defined value
        const {userId} = req.value.params;
        //const newCar = new Car(req.body);
        const newCar = new Car(req.value.body);
        //console.log(newCar);
        const user = await User.findById(userId);
        //assig user as cars seller
        newCar.seller = user;
        await newCar.save();
        //Add car to users selling array 'car'
        user.cars.push(newCar);
        await user.save();
        res.status(201).json(newCar);
    }

};

// Three ways of itneration with mongoose
//1> Callback
//2> Promises
//3> Async/Await (Promises)