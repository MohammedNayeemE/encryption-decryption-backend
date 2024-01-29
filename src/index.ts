import { User , Algo , Auth } from '../routers';
import cors from 'cors'
import express from 'express'
import { errorHandler } from '../middleware/errorhandling';


const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());

app.use(User.BASE_ROUTE , User.router);
app.use(Algo.BASE_ROUTE , Algo.router);
app.use(Auth.BASE_ROUTE , Auth.router);

app.use(errorHandler);

app.listen(PORT , ()=>{
  console.log(`Server is Running at *${PORT}`);
  
})