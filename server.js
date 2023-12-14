import mongoose from 'mongoose';
import app from './app.js';
import dontenv from 'dotenv';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXEPTION OCCURED!!! Shuting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dontenv.config({ path: './.env' });

const db_url = process.env.DB_URL.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD,
);

console.log(db_url);

mongoose
  .connect(db_url, {
    useNewUrlParser: true,
  })
  .then(() => console.log('DB connection successfull'))
  .catch(() => console.log('DB connection failed'));

const PORT = process.env.PORT || 8001;
const server = app.listen(PORT, () => {
  console.log(`app running on port: ${PORT} `);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION OCCURED!!! Shuting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
