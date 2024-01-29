import { Request , Response , NextFunction } from "express";

const validateMD5 = (req : Request , res : Response , next : NextFunction) =>{
    const {text} = req.body
    if(!text || typeof text !== 'string' || text.trim().length === 0){
        return res.status(400).json(
            {
                error : 'Invalid or missing text parameter'
            }
        )
    }
    next();
}

const validatedCAESER = (req : Request , res : Response , next : NextFunction) =>{
    const {plaintext  , hashedtext , operation , key} = req.body;
    if(typeof key != "number" || (! plaintext && !hashedtext) || !operation){
        return res.status(400).json(
            {
                error : `Invalid or missing parameters`
            }
        )
    }
    next();
} 

const validateBASE64 = (req : Request , res : Response , next : NextFunction) =>{
    const {plaintext  , hashed , operation } = req.body;
    if((! plaintext && !hashed) || !operation){
        return res.status(400).json(
            {
                error : `Invalid or missing parameters`
            }
        )
    }
    next();
} 

const validateROT13 = (req : Request , res : Response , next : NextFunction) =>{
    const {plaintext  , hashed , operation } = req.body;
    if((! plaintext && !hashed) || !operation){
        return res.status(400).json(
            {
                error : `Invalid or missing parameters`
            }
        )
    }
    next();
} 
export {validateBASE64 , validateMD5 , validatedCAESER , validateROT13};
