import express from 'express';
import morgan from 'morgan'; 
import bodyParser from 'body-parser'; 
import cors from 'cors'; 
import freelancersController from './controllers/FreelancersController.js';
import empresasController from './controllers/empresaController.js'; 
import authController from './controllers/authControllers.js'; 

const app = express();

const corsOptions = {
   origin: '100.20.92.101', 
   optionsSuccessStatus: 204 
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use((req, res, next) => {
    console.log('Se recibió una solicitud');
    next();
  });
app.use((err,  res, next) => {
    console.error(err.stack);
    res.status(500).send("Error Del Servidor");
    next();
  });
  

// Usa la ruta '/api' para las rutas de autenticación
app.use('/api/auth', authController);  // Cambiado a /api/auth

// Asegúrate de que estas rutas estén después de body-parser
app.use('/api/freelancers', freelancersController);
app.use('/api/empresas', empresasController);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`YA no lo muevas porque corriendo en el puerto: ${PORT}`);
});
