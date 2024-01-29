import express from 'express';

const router = express.Router();

const BASE_ROUTE = '/users';

router.get('/' , (req , res)=>{
    res.send('you are a user');
})


const MODULE  = {
    router ,
    BASE_ROUTE
}

export default MODULE;