import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import imagesRoutes from './routes/imagesRoutes.js';
import userRoutes from './routes/userRoutes.js';
import setupRoutes from './routes/setupRoutes.js';
import roleRoutes from './routes/roleRoutes.js'; // Ensure roleRoutes is imported
import campaignRoutes from './routes/campaignRoutes.js';
import morgan from 'morgan';
import {createPermissions, createRoles} from './utils/permissionsUtils.js'
import clientRouter from './routes/clientRoutes.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(morgan('dev'));


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
    sameSite: 'lax', 
  }
}));


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(cookieParser());


const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('Serving uploads from:', path.join(__dirname, 'uploads'));

const initRolesAndPermissions = async () => {
  const permissions = await createPermissions();
  await createRoles(permissions);
};
initRolesAndPermissions().then(() => {
}).catch((error) => {
  console.error('Error initializing Permissions and Roles:', error);
});

app.use('/api/users', userRoutes);
app.use('/api/images', imagesRoutes);
app.use('/api/setup', setupRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/campaigns', campaignRoutes)
app.use('/api/clients', clientRouter)


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/dist')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));