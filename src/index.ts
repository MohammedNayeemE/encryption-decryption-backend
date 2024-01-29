import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express';
import md5 from '../algorithms/md5';
import {  caesarCipher,  caesarDecrypt } from '../algorithms/ceaser';
import { encodebase64 } from '../algorithms/base64';
import { decodebase64 } from '../algorithms/base64';
import { errorHandler } from '../middleware/errorhandling';
import { validateBASE64 , validateMD5 , validatedCAESER  , validateROT13} from '../middleware/validation';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET , TOKEN_EXPIRY_DURATION } from '../constants';
import { drot13, rot13 } from '../algorithms/rot13';
import { generateOTP } from '../lib/utils/generateUniqueToken';
import { sendthroughMail } from '../lib/utils/SendMail';


const cors = require('cors');
const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(cors());


app.get('/' , (req:Request , res:Response)=>{
    res.send('<h1>ENCRYPTION API</h1><ul><li>md5</li><li>caeser</li><li>base64</li><li>rot13</li></ul>');
})

app.post('/md5' , validateMD5 , async (req : Request , res : Response) =>{
    const {text} = req.body;
    if(!text){
        res.status(400).send(`missing text`);
    }
    const hashed = md5(text);
    try{
        const response = await prisma.hash.create({
            data:{
                original : text,
                hashed : hashed

            }
        })
        res.status(200).json({
            id : response.id,
            original : response.original,
            hashed : response.hashed
        })
    }
    catch(error){
        console.error('error creating hash' , error);
        res.status(500).send(`error creatig hash`);
        
    }
    
})

app.post('/caeser' , validatedCAESER , async (req : Request , res : Response) =>{
   const {plaintext , hashedtext , operation , key} = req.body;
   let Text:string = plaintext;
   let HText:string = hashedtext;

   if(operation === 'up'){
    HText = caesarCipher(plaintext , key );
   }
   else{
    Text = caesarDecrypt(hashedtext , key);
   }
   try{
      const response = await prisma.caeser.create({
        data :{
            plaintext : Text,
            hashed : HText,
            operation : operation,
            key : key
        }
      })
      res.status(200).json(
        {
            id : response.id,
            opeartin : response.operation,
            hashed : response.hashed,
            plaintext : response.plaintext,
            key : response.key
        }
      )
   }
   catch(error){
    console.error(error);
    res.status(400).send(`error in server`);
    
   }

})
app.post('/base64' , validateBASE64 ,async(req : Request , res : Response)=>{
    const {plaintext , hashed , operation} = req.body;
    let plain:string = plaintext;
    let hash:string = hashed;
    if(operation === 'up'){
        hash = encodebase64(plain);
    }
    else{
        plain = decodebase64(hash);
    }

    try{
        const response = await prisma.base64.create({
            data :{
                plaintext : plain,
                hashed : hash,
                operation : operation
            }
        })
        res.status(200).json({
            id : response.id,
            plaintext : response.plaintext,
            hashed : response.hashed,
            operation : response.operation
        })
    }
    catch(error){
        console.error(error);
        res.status(400).send(`unexpexted error occured`);
        
    }
})

app.post('/rot13' , validateROT13 ,  async (req : Request , res : Response) =>{
    const {plaintext , hashed , operation} = req.body;
    let plain:string = plaintext;
    let hash:string = hashed;
    if(operation === 'up'){
        hash = rot13(plain);
    }
    else{
        plain = drot13(hash);
    }

    try{
        const response = await prisma.rot13.create({
            data :{
                plaintext : plain,
                hashed : hash,
                operation : operation
            }
        })
        res.status(200).json({
            id : response.id,
            plaintext : response.plaintext,
            hashed : response.hashed,
            operation : response.operation
        })
    }
    catch(error){
        console.error(error);
        res.status(400).send(`unexpexted error occured`);
        
    }
})

//user route
//@signup
app.post('/signup' , async (req : Request , res : Response) =>{
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
//@login
app.post('/login' ,async (req : Request , res : Response) => {
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
//@logout
app.post('/logout' , async ( req : Request , res : Response)=>{
    res.clearCookie('authToken');
    res.status(200).json({
        message : 'User logged Out successfully'
    })
});
//@forget password

app.post('/forget-password' , async (req : Request , res : Response) =>{
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

app.post('/verify-token' , async (req : Request , res : Response) =>{
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
app.post('/reset-password' , async (req : Request , res : Response) =>{
    const {password , email} = req.body;
    // try{
    //  const user = await prisma.user.findUnique({
    //     where:{
    //         email : email
    //     }
    // })
    // if(!user){
    //     return res.status(401).json({message : 'Unauthorised'})
    // }
    // }
    // catch(error){
    //    return res.status(500).json({message : 'Internal Server Error'})

    // }
    
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


app.use(errorHandler);

app.listen(PORT , ()=>{
    console.log(`Server running at *${PORT}`);
    
})
