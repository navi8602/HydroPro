// server/routes/system.ts
/**
 * @swagger
 * /api/systems:
 *   get:
 *     summary: Get all rented systems
 *     tags: [Systems]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of rented systems
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/System'
 */
router.get('/', auth, systemController.getRentedSystems);

/**
 * @swagger
 * /api/systems/{systemId}/metrics:
 *   put:
 *     summary: Update system metrics
 *     tags: [Systems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: systemId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Metrics'
 *     responses:
 *       200:
 *         description: Updated metrics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Metrics'
 */
router.put('/:systemId/metrics', auth, systemController.updateSystemMetrics);
