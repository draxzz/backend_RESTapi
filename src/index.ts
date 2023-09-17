import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const swaggerJsdoc = require("swagger-jsdoc"), swaggerUi = require("swagger-ui-express");


app.use(cors({
    credentials:true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const options = {
  definition: {
    openapi:"3.1.0",
    info:{
      title:"Backend REST API",
      version: '1.0.0',
      description: 'API documentation for your Express.js application',
    },
  },
  servers:[
    {
      url:`http://localhost:${process.env.PORT}`,
    }
  ],
  apis:["./src/router/*.ts"]
};

const specs = swaggerJsdoc(options);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCssUrl:
    "https://cdn.example.com/path/to/theme.css",
  })
);

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

// mongoose.Promise = Promise;
// mongoose.connect(MONGO_URL);
// mongoose.connection.on('error',(error: Error) => console.log(error));
mongoose.connect(process.env.MONGO_URL || "")
  .then(() => {
    console.log('DB Connected');
  })
  .catch((error) => {
    console.error('DB Connection Error:', error);
  });

app.use('/',router())