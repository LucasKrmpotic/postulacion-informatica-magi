import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import jade from 'jade';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import router from './router';
import $config from '../config/config.json';
import cors from "cors";
import errorHandler from "./_helpers/error-handler";
import jwt from "./_helpers/jwt";

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Add headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

app.use(cors());
// use JWT auth to secure the api
app.use(jwt());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));

// global error handler
app.use(errorHandler);
router(app)

app.listen($config.servePort || 3000);
