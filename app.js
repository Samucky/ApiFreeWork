import express from 'express';
import cors from 'cors';
import morgan from 'morgan'; 
import bodyParser from 'body-parser'; 
import freelancersController from './controllers/FreelancersController.js';
import empresasController from './controllers/empresaController.js'; 
import authController from './controllers/authControllers.js'; 
import dotenv from 'dotenv'; // Importa dotenv

dotenv.config(); // Carga las variables de entorno

const app = express();

// Usa las variables de entorno
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(','); // Divide las URLs por comas
const token = process.env.TOKEN; // Obtiene el token de las variables de entorno

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Acceso denegado por CORS'));
        }
    },
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rutas de tu aplicación
app.use('/api/auth', authController);
app.use('/api/freelancers', freelancersController);
app.use('/api/empresas', empresasController);

// Ejemplo de uso del token en una ruta
app.get('/api/token', (req, res) => {
    res.json({ token });
});

const PORT = process.env.PORT || 3001; // Usa la variable de entorno o un valor por defecto
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
});
