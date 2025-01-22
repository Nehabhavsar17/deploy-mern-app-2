const { signup, login } = require('../Controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');
const upload = require('../utils/multer'); 
const router = require('express').Router();
 
router.post('/login', loginValidation, login);
router.post('/signup', upload.single('profileImage'), signupValidation, signup);

module.exports = router;
