import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import freelancersController from './controllers/FreelancersController.js';
import empresasController from './controllers/empresaController.js';
import authController from './controllers/authControllers.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: '*', // Permite todas las solicitudes
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Freelancers y Empresas',
            version: '1.0.0',
            description: 'API para gestionar freelancers y empresas'
        },
        servers: [
            {
                url: 'http://localhost:3001/api',
                description: 'Servidor local'
            }
        ]
    },
    apis: ['./controllers/*.js'], // Aquí especificas dónde Swagger buscará los comentarios de las rutas
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Rutas de autenticación
app.use('/api/auth', authController);

// Rutas de freelancers y empresas
app.use('/api/freelancers', freelancersController);
app.use('/api/empresas', empresasController);

// Puerto de escucha
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`YA no lo muevas porque corriendo en el puerto: ${PORT}`);
});
