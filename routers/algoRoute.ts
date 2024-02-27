import express from 'express';
import { validateMD5  , validatedCAESER , validateBASE64 , validateROT13} from '../middleware/validation';
import { Request , Response } from 'express';
import md5 from '../algorithms/md5';
import { caesarCipher , caesarDecrypt } from '../algorithms/ceaser';
import { encodebase64 , decodebase64 } from '../algorithms/base64';
import { rot13 , drot13 } from '../algorithms/rot13';
import { PrismaClient } from '@prisma/client';

const prisma =  new PrismaClient();
const router = express.Router();

const BASE_ROUTE = '/algo';


router.post('/md5' , validateMD5 , async (req : Request , res : Response) =>{
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

router.post('/caeser' , validatedCAESER , async (req : Request , res : Response) =>{
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

router.post('/base64' , validateBASE64 ,async(req : Request , res : Response)=>{
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

router.post('/rot13' , validateROT13 ,  async (req : Request , res : Response) =>{
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

const MODULE = {
    router ,
    BASE_ROUTE
}

export default MODULE;
