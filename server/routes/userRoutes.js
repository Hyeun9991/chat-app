const { register, login } = require('../controllers/usersController');

const router = require('express').Router(); // express 모듈에서 Router 함수 가져옴

router.post('/register', register);
router.post('/login', login);

module.exports = router;
