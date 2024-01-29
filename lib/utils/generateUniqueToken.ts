
import { randomInt } from "crypto";

const generateOTP = () : string =>{
    const randomNumber = randomInt(0 , 99999);
    const randomString  = randomNumber.toString().padStart(6 , "0");
    return randomString;
}

export {generateOTP}