const Car = require('../models/car');
const User = require('../models/user');


module.exports = {
    index: async (req, res, next) => {
        const cars = await Car.find({});
        res.status(200).json(cars);
    },

    newCar: async (req, res, next) => {
        //Find seller
        //const seller = await User.findById(req.body.seller);
        //Using validation so we tradtitionally use value
        const seller = await User.findById(req.value.body.seller);
        //Create new car
        //const newCar = req.body;
        //Using validation so we tradtitionally use value
        const newCar = req.value.body;
        delete newCar.seller;
        const car = new Car(newCar);
        car.seller = seller;

        await car.save();
        //Add created car to seller
        seller.cars.push(car);
        await seller.save();
        
        res.status(200).json(car);
    },

    getCarById: async (req, res, next) => {
        //const car = await Car.findById(req.params.carId);
        //Using validation so we tradtitionally use value
        const car = await Car.findById(req.value.params.carId);
        res.status(200).json(car);
    },

    replaceCar: async (req, res, next) => {
        //Using validation so we tradtitionally use value
        const {carId} = req.value.params;
        const newCar = req.value.body;

        const result = await Car.findByIdAndUpdate(carId,newCar);
        res.status(200).json({success:true});

    },

    updateCar: async (req, res, next) => {
        //Using validation so we tradtitionally use value
        const {carId} = req.value.params;
        const newCar = req.value.body;
        
        const result = await Car.findByIdAndUpdate(carId,newCar);
        res.status(200).json({success:true});
    },

    deleteCar: async (req, res, next) => {
        //Using validation so we tradtitionally use value
        const {carId} = req.value.params;
        //get car
        const car = await Car.findById(carId);
        if(!car) {
            return res.status(404).json({error:'Car does not exist'});
        }
        //get seller
        const sellerId = car.seller;
        const seller = await User.findById(sellerId);
        //remove car
        await car.remove();
        //remove car from user.cars array
        seller.cars.pull(car);
        await seller.save();

        res.status(200).json({success: true});
    }
}