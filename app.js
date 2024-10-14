import express from 'express';
import morgan from 'morgan'; 
import bodyParser from 'body-parser'; 
import cors from 'cors'; 
import freelancersController from './controllers/FreelancersController.js';
import empresasController from './controllers/empresaController.js'; 
import authController from './controllers/authControllers.js'; 

const app = express();
const allowedOrigins = ['100.20.92.101'];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin)) {
          callback(null, true);  // Permitir si el origen está en la lista
        } else {
          callback(new Error('Acceso no permitido por CORS'));  // Bloquear si no está en la lista
        }
      },
  optionsSuccessStatus: 204 // Estado para respuestas pre-flight (OPCIONAL)
};


app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


// Usa la ruta '/api' para las rutas de autenticación
app.use('/api/auth', authController);  // Cambiado a /api/auth

// Asegúrate de que estas rutas estén después de body-parser
app.use('/api/freelancers', freelancersController);
app.use('/api/empresas', empresasController);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`YA no lo muevas porque corriendo en el puerto: ${PORT}`);
});
