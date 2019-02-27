const Joi = require('joi');


module.exports = {
    
    //schema that we want to validate on and params to validate
    validateParam: (schema,name) => {
        return (req,res,next) => {
            console.log('res.params',req.params);
            //req['params'][name] it's the same like re.params.name
            // but we want it to work for different variables names not only for one
            // so we don't hardcode it like params.userId but we allow function
            // to detect name on it's own
            //Joi validate creates new object and checks it agains schema
            const result = Joi.validate({param:req['params'][name]},schema);
            if(result.error) {
                return res.status(400).json(result.error);
            } else {
                if(!req.value)
                    req.value = {};

                if(!req.value['params'])
                    req.value['params'] = {};

                req.value['params'][name] = result.value.param;
                next();
            }
        }
    },

    //here we will capture only one way so its just schema
    validateBody: (schema) => {
        return (req,res,next) => {
            const result = Joi.validate(req.body,schema);

            if (result.error) {
                return res.status(400).json(result.error);
            } else {
                if (!req.value)
                    req.value = {};

                if (!req.value['body'])
                    req.value['body'] = {};
                
                req.value['body'] = result.value;
                next();
            }
        }
    },

    schemas: {

        idSchema: Joi.object().keys({
        //^ -at the begining of line
        //[] -in calibraces
        //0-9 range
        //a-f - range of letters lowercase
        //A-F - range of letters uppercase
        //{24} - number of elements 24 letters/numbers together
        //$ - end of line
            param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }),
        
        userSchema: Joi.object().keys({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required()
        }),

        userOptionalSchema: Joi.object().keys({
            firstName: Joi.string(),
            lastName: Joi.string(),
            email: Joi.string().email()
        }),

        userCarSchema: Joi.object().keys({
            make: Joi.string().required(),
            model: Joi.string().required(),
            year: Joi.number().required()
        }),

        carSchema: Joi.object().keys({
            seller: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            make: Joi.string().required(),
            model: Joi.string().required(),
            year: Joi.number().required()
        }),

        putCarSchema: Joi.object().keys({
            make: Joi.string().required(),
            model: Joi.string().required(),
            year: Joi.number().required()
        }),

        patchCarSchema: Joi.object().keys({
            make: Joi.string(),
            model: Joi.string(),
            year: Joi.number()
        })
    }

}
