// import { Request , Response , NextFunction } from "express";
// import jwt from 'jsonwebtoken'
// import { JWT_SECRET } from "../constants";
// const authenticationUser = (req : Request , res : Response , next : NextFunction) =>{
//     const token = req.cookies['authToken'];
//     if(!token){
//         return res.status(401).json(
//             {
//                 message : "Unauthorised"
//             }
//         );
//     }
//     try{
//         const decoded = jwt.verify(token , JWT_SECRET) as {
//             userId : number
//         }
//         req.userId  = decoded.userId;
//         next();
//     }
//     catch(error){
//         return res.status(401).json({
//             message : 'Unauthorised'
//         })
//     }
// }

// export {authenticationUser};;