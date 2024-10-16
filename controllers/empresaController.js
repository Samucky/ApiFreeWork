import express from "express";
import { check, validationResult } from 'express-validator';
import empresaService from "../services/empresaServices.js";
import Empresa from "../models/empresaModels.js";

const router = express.Router();

/**
 * @swagger
 * /empresas:
 *   get:
 *     summary: Obtener todas las empresas
 *     tags: [Empresas]
 *     responses:
 *       200:
 *         description: Lista de todas las empresas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Empresa'
 *       500:
 *         description: Error en el servidor.
 */
router.get('/empresas', async (req, res) => {
    try {
        const empresas = await empresaService.getAllEmpresas();
        res.json(empresas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /empresas:
 *   post:
 *     summary: Crear una nueva empresa
 *     tags: [Empresas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Empresa'
 *     responses:
 *       201:
 *         description: Empresa creada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Empresa'
 *       400:
 *         description: Error de validación de entrada.
 *       500:
 *         description: Error en el servidor.
 */
router.post("/empresas", [
    check('nombre_empresa').not().isEmpty().withMessage('El nombre de la empresa es requerido'),
    check('correo_electronico').isEmail().withMessage('El correo electrónico debe ser válido')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id, nombre_empresa, correo_electronico, telefono, representante } = req.body;
        const newEmpresa = new Empresa(id, nombre_empresa, correo_electronico, telefono, representante);
        const addedEmpresa = await empresaService.addEmpresa(newEmpresa);

        res.status(201).json(addedEmpresa);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /empresas/{id}:
 *   put:
 *     summary: Actualizar una empresa por ID
 *     tags: [Empresas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la empresa a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Empresa'
 *     responses:
 *       200:
 *         description: Empresa actualizada con éxito.
 *       404:
 *         description: Empresa no encontrada.
 *       500:
 *         description: Error en el servidor.
 */
router.put("/empresas/:id", async (req, res) => {
    try {
        const updatedEmpresa = await empresaService.updateEmpresa(req.params.id, req.body);
        res.json(updatedEmpresa);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /empresas/id/{id}:
 *   delete:
 *     summary: Eliminar una empresa por ID
 *     tags: [Empresas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la empresa a eliminar
 *     responses:
 *       200:
 *         description: Empresa eliminada con éxito.
 *       404:
 *         description: Empresa no encontrada.
 *       500:
 *         description: Error en el servidor.
 */
router.delete('/empresas/id/:id', async (req, res) => {
    try {
        const result = await empresaService.deleteEmpresa(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /empresas/representante/{representante}:
 *   get:
 *     summary: Buscar empresas por representante
 *     tags: [Empresas]
 *     parameters:
 *       - in: path
 *         name: representante
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del representante
 *     responses:
 *       200:
 *         description: Empresas encontradas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Empresa'
 *       404:
 *         description: No se encontraron empresas con ese representante.
 *       500:
 *         description: Error en el servidor.
 */
router.get('/empresas/representante/:representante', async (req, res) => {
    try {
        const empresas = await empresaService.findEmpresasByRepresentante(req.params.representante);
        
        if (empresas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron empresas con ese representante' });
        }

        res.json(empresas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
