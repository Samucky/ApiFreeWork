import express from 'express';
import { check, validationResult } from 'express-validator';
import authService from '../services/authServices.js';

const router = express.Router();
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: usuario123
 *               password:
 *                 type: string
 *                 example: contraseñaSegura123
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: usuario123
 *       400:
 *         description: Error de validación de entrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: El nombre de usuario es requerido
 *       500:
 *         description: Error en el servidor
 */

router.post('/register', [
    check('username').not().isEmpty().withMessage('El nombre de usuario es requerido'),
    check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { username, password } = req.body;
        const newUser = await authService.register(username, password);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión de un usuario
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: usuario123
 *               password:
 *                 type: string
 *                 example: contraseñaSegura123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, devuelve el token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Error en la solicitud, credenciales inválidas o campos vacíos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: El nombre de usuario y la contraseña son requeridos
 *       500:
 *         description: Error en el servidor
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Verifica que los campos no estén vacíos
        if (!username || !password) {
            return res.status(400).json({ error: 'El nombre de usuario y la contraseña son requeridos' });
        }

        // Intenta iniciar sesión
        const token = await authService.login(username, password);
        res.json({ token });
    } catch (error) {
        console.error('Error en el login:', error); // Agregar registro de error para depuración
        res.status(400).json({ error: error.message });
    }
});

export default router;