const { Router } = require("express");
const router = Router();
const { authenticate } = require("../middlewares/checkToken");
const { body, validationResult } = require("express-validator");
const checkChief = require("../middlewares/checkChief");
const checkAdmin = require("../middlewares/checkAdmin");
const {
  signup,
  login,
  verify,
  newOrder,
  getOrders,
  getOrderById,
  deleteOrder,
  logout,
} = require("../controllers/user.controller");
const { getMenu, getDishById } = require("../controllers/admin.controller");
require("express-group-routes");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User related operations
 */

/**
 * @swagger
 * /api/register/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: User successfully registered
 *       400:
 *         description: Invalid input data
 */

router.group("/register", (route) => {
  route.post(
    "/signup",
    [
      body("username")
        .isLength({ max: 50 })
        .withMessage("Qisqaroq ism kiriting.")
        .isLength({ min: 2 })
        .withMessage("Uzunroq ism kiriting."),
      body("email")
        .isEmail()
        .withMessage("Iltimos, email ni to'g'ri kiriting.")
        .matches("@gmail.com$", "i")
        .withMessage("Iltimos, faqat @gmail.com manzillarini kiriting."),
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            success: false,
            errors: errors.array(),
          });
        }
        next();
      },
    ],
    signup
  );

  /**
   * @swagger
   * /api/register/login:
   *   post:
   *     summary: Login an existing user
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *     responses:
   *       200:
   *         description: User successfully logged in
   *       400:
   *         description: Invalid input data
   */
  route.post(
    "/login",
    [
      body("email")
        .isEmail()
        .withMessage("Iltimos, email ni to'g'ri kiriting.")
        .matches("@gmail.com$", "i")
        .withMessage("Iltimos, faqat @gmail.com manzillarini kiriting."),
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            success: false,
            errors: errors.array(),
          });
        }
        next();
      },
    ],
    login
  );

  /**
   * @swagger
   * /api/register/verify:
   *   post:
   *     summary: Verify a user's OTP for login
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               otp:
   *                 type: string
   *                 description: OTP sent to the user
   *     responses:
   *       200:
   *         description: OTP successfully verified
   *       400:
   *         description: Invalid input data
   */
  route.post(
    "/verify",
    [
      body("email")
        .isEmail()
        .withMessage("Iltimos, email ni to'g'ri kiriting.")
        .matches("@gmail.com$", "i")
        .withMessage("Iltimos, faqat @gmail.com manzillarini kiriting."),
      body("otp")
        .isLength({ min: 4 })
        .withMessage("OTP ni to'liq kiriting.")
        .isLength({ max: 4 })
        .withMessage("OTP ni to'liq kiriting."),
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            success: false,
            errors: errors.array(),
          });
        }
        next();
      },
    ],
    verify
  );
});

/**
 * @swagger
 * /api/menu:
 *   get:
 *     summary: Get the menu
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Menu fetched successfully
 *       500:
 *         description: Server error
 */
router.get("/menu", authenticate, getMenu);

/**
 * @swagger
 * /api/menu/{id}:
 *   get:
 *     summary: Get a specific dish from the menu by ID
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Dish ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dish fetched successfully
 *       404:
 *         description: Dish not found
 */
router.get("/menu/:id", authenticate, getDishById);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Order created successfully
 *       500:
 *         description: Server error
 */
router.group("/orders", (route) => {
  route.post("/", authenticate, newOrder);
});

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get a specific order by ID
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details fetched successfully
 *       404:
 *         description: Order not found
 */
router.get("/orders/:id", authenticate, checkChief, getOrderById);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */
router.delete("/orders/:id", authenticate, checkAdmin, deleteOrder);

/**
 * @swagger
 * /api/register/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User successfully logged out
 *       401:
 *         description: Unauthorized or Invalid token
 *       404:
 *         description: User not found
 */
router.post("/auth/register/logout", authenticate, logout);

module.exports = router;
