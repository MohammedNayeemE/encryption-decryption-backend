import { Request , Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import { sendthroughMail } from "../lib/utils/SendMail";
import { generateOTP } from "../lib/utils/generateUniqueToken";
import { JWT_SECRET , TOKEN_EXPIRY_DURATION } from "../constants";


const router = express.Router();
const prisma = new PrismaClient();
const BASE_ROUTE = '/auth';


router.post('/signup' , async (req : Request , res : Response) =>{
    const {
        username , email , password , image
    } = req.body;

    const hashedPassword = await bcrypt.hash(password , 10);

    try{
        const user =  await prisma.user.create({
            data : {
                username : username,
                password : hashedPassword,
                email : email,
                image : image
            }
        })

        const token = jwt.sign(
            {userId : user.id} , JWT_SECRET
        );

        res.cookie('authToken' , token , {httpOnly : true })
        res.status(201).json({
            message : 'User Signed succesfully'
        });
    }
    catch(error){
        console.error(`Error Signing up` , error);
        res.status(500).json({
            message : 'Internal Service Error'
        })
        
    }
})

router.post('/login' ,async (req : Request , res : Response) => {
    const {email , password} = req.body;
    try{
        const user = await prisma.user.findUnique({
            where : {
                email
            }
        });
        if(!user){
           return res.status(401).json({message : 'Invalid Bitch'})
        }
        const passwordMatch = await bcrypt.compare(password , user.password);
        if(!passwordMatch){
            return res.status(401).json({
                message : 'Invalid Password'
            })
        }

        const token = jwt.sign({userId : user.id} , JWT_SECRET);

        res.cookie('authToken' , token , {httpOnly : true})

        res.status(200).json({
            message : 'Logged in successfully'
        })
    }
    catch(error){
        console.error('error loggin in' , error);
        res.status(500).json({
            error : 'internal server error'
        })
        
    }
});
router.post('/logout' , async ( req : Request , res : Response)=>{
    res.clearCookie('authToken');
    res.status(200).json({
        message : 'User logged Out Successfully'
    })
});

router.post('/forget-password' , async (req : Request , res : Response) =>{
    const { email } = req.body;
    try{
        const user = await prisma.user.findUnique({
            where : {
                email : email
            }
        })
        if(!user){
            return res.status(401).json({message : 'No user with this email'})
        }
        if(user){
            const token = generateOTP();
           // const hashedToken = await bcrypt.hash(token , 10);
            try{
              const response = await prisma.passwordReset.create({
                data : {
                    userId : user.id,
                    token : token,
                    expiresAt : new Date(Date.now()+ TOKEN_EXPIRY_DURATION)
                }
              })
              if(response){
                const result = await sendthroughMail(token , email);
                if(result){
                  res.status(201).json({
                    message : 'token sent for verification'
                  })
                }

              }
             
            }
            catch(error){
               return res.status(500).json({
                error : 'Internal Server Error'
               })
            }
        }
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message : 'Internal server error'})
        
    }
    

})

//@verify-token

router.post('/verify-token' , async (req : Request , res : Response) =>{
    const {token , email} = req.body;
    const user = await prisma.user.findUnique({
            where : {
                email : email
            }
        })
        if(!user){
            return res.status(401).json({message : 'No user with this email'})
        }
    const passwordReset = await prisma.passwordReset.findFirst({
        where : {
            userId : user.id ,
            token : token,
            expiresAt : {gte : new Date()}
        }
    })
    if(!passwordReset){
        return res.status(400).json({
            message : 'Invalid Token Or Expired Token'
        })
    }
    else{
        res.status(201).json({
            message : 'token verified you can change your password'
        })
    }
    
})

//@reset-password
router.post('/reset-password' , async (req : Request , res : Response) =>{
    const {password , email} = req.body;
     
    const hashedPassword = await bcrypt.hash(password , 10) ;
    try{
    const response = await prisma.user.update({
        where : {
            email : email
        },
       data : {
            password : hashedPassword
        }
    })
    if(response){
        res.status(200).json({
            message : 'Password reset successfull'
        })
    }
    }
    catch(error){
      return res.status(500).json({
        message : 'Internl server error'
      })
    }

})

const MODULE = {
    router ,
    BASE_ROUTE,
}

export default MODULE;


