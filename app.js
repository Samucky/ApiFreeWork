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

const allowedOrigins = [
  'http://100.20.92.101',
  'http://44.225.181.72',
  'http://44.227.217.144'
];

const corsOptions = {
  origin: function (origin, callback) {
      // Si el origen es undefined (por ejemplo, cuando se accede desde herramientas de desarrollo), permitir
      if (!origin) return callback(null, true);
      
      // Verificar si el origen está en la lista de permitidos
      if (allowedOrigins.includes(origin)) {
          callback(null, true);
      } else {
          callback(new Error('Acceso denegado por CORS')); // Denegar si no está permitido
      }
  },
  optionsSuccessStatus: 204 // Para navegadores que requieren un estado 204 para las solicitudes pre-flight
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
