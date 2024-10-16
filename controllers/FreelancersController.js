import express from "express";
import { check, validationResult } from 'express-validator';
import freelancerService from "../services/FreelancerServices.js";
import Freelancer from "../models/freelancerModels.js";
import { verifyToken } from '../middlware/authMiddleware.js';

const router = express.Router();

// Todas las rutas protegidas con verifyToken

/**
 * @swagger
 * /api/freelancers:
 *   get:
 *     summary: Obtener todos los freelancers
 *     tags:
 *       - Freelancers
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos los freelancers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Freelancer'
 *       500:
 *         description: Error en el servidor
 */
router.get('/freelancers', verifyToken, async (req, res) => {
    try {
        const freelancers = await freelancerService.getAllFreelancers();
        res.json(freelancers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/freelancers:
 *   post:
 *     summary: Crear un nuevo freelancer
 *     tags:
 *       - Freelancers
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan Pérez
 *               edad:
 *                 type: integer
 *                 example: 30
 *               carrera:
 *                 type: string
 *                 example: Ingeniero en Software
 *               años_de_experiencia:
 *                 type: integer
 *                 example: 5
 *               habilidades:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["JavaScript", "Node.js"]
 *               tarifa_por_hora:
 *                 type: number
 *                 example: 25
 *     responses:
 *       201:
 *         description: Freelancer creado exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error en el servidor
 */
router.post('/freelancers', 
    verifyToken, 
    [
        check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
        check('carrera').not().isEmpty().withMessage('La carrera es requerida')
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { nombre, edad, carrera, años_de_experiencia, habilidades, tarifa_por_hora, proyectos_anteriores, disponibilidad, ubicacion, calificaciones_o_reseñas, certificaciones, idiomas } = req.body;
            
            const newFreelancer = new Freelancer(
                nombre, edad, carrera, años_de_experiencia, habilidades, tarifa_por_hora, proyectos_anteriores, disponibilidad, ubicacion, calificaciones_o_reseñas, certificaciones, idiomas
            );

            const addedFreelancer = await freelancerService.addFreelancer(newFreelancer);

            res.status(201).json(addedFreelancer);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

/**
 * @swagger
 * /api/freelancers/{id}:
 *   put:
 *     summary: Actualizar un freelancer por ID
 *     tags:
 *       - Freelancers
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del freelancer a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Freelancer'
 *     responses:
 *       200:
 *         description: Freelancer actualizado exitosamente
 *       404:
 *         description: Freelancer no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.put("/freelancers/:id", verifyToken, async (req, res) => {
    try {
        const updatedFreelancer = await freelancerService.updateFreelancer(req.params.id, req.body);
        res.json(updatedFreelancer);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/freelancers/nombre/{nombre}:
 *   delete:
 *     summary: Eliminar un freelancer por nombre
 *     tags:
 *       - Freelancers
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del freelancer a eliminar
 *     responses:
 *       200:
 *         description: Freelancer eliminado exitosamente
 *       404:
 *         description: Freelancer no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.delete('/freelancers/nombre/:nombre', verifyToken, async (req, res) => {
    try {
        const result = await freelancerService.deleteFreelancer(req.params.nombre);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/freelancers/carrera/{carrera}:
 *   get:
 *     summary: Buscar freelancers por carrera
 *     tags:
 *       - Freelancers
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: carrera
 *         required: true
 *         schema:
 *           type: string
 *         description: Carrera del freelancer
 *     responses:
 *       200:
 *         description: Lista de freelancers por carrera
 *       404:
 *         description: No se encontraron freelancers con esa carrera
 *       500:
 *         description: Error en el servidor
 */
router.get('/freelancers/carrera/:carrera', verifyToken, async (req, res) => {
    try {
        const freelancers = await freelancerService.findFreelancersByCareer(req.params.carrera);
      
        if (freelancers.length === 0) {
            return res.status(404).json({ message: 'No se encontraron freelancers con esa carrera' });
        }

        res.json(freelancers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
