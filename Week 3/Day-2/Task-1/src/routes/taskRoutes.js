const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const validateRequest = require("../middleware/validateRequest");
const auth = require("../middleware/auth");
const taskController = require("../controllers/taskController");

/**
 * @swagger
 * tags:
 *   - name: Tasks
 *     description: CRUD operations for tasks
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of tasks
 */
router.get("/", auth, taskController.getTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a single task by id (must belong to user)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Task object
 *       404:
 *         description: Not found
 */
router.get("/:id", auth, taskController.getTask);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  auth,
  [check("title").notEmpty().withMessage("Title is required")],
  validateRequest,
  taskController.createTask
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated
 */
router.put(
  "/:id",
  auth,
  [
    check("title")
      .optional()
      .notEmpty()
      .withMessage("Title, if provided, cannot be empty"),
  ],
  validateRequest,
  taskController.updateTask
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/:id", auth, taskController.deleteTask);

// Add a route to handle the root path
/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Root route for tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Welcome message
 */
router.get("/", (req, res) => {
  res.send("Welcome to the Tasks API!");
});

module.exports = router;
