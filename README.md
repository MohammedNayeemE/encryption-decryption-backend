# encryption-decryption-backend

npm init -y
npm i --save-dev prisma typescript ts-nodes  nodemon express cors dotenv nodemailer bcrypt jsonwebtoken

npm i @types/node @types/express @types/bcrypt @types/jsonwebtoken @types/nodemailer

npm prisma init --datasource-provider postgresql

npx prisma migrate dev --name init

npx prisma generate

create .env file , enter DATABASE_URL and PORT , enter your mail and password for nodemailer

cd src/

npm run start


