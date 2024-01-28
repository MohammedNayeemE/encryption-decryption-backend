# encryption-decryption-backend

npm init -y
npm i --save-dev prisma typescript ts-nodes  nodemon express cors dotenv

npm i @types/node @types/express @types/bcrypt @types/jsonwebtoken

npm prisma init --datasource-provider postgresql

npx prisma migrate dev --name init

npx prisma generate

create .env file , enter DATABASE_URL and PORT 

cd src/

npm run start


