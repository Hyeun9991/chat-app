const { register } = require('../controllers/usersController');

const router = require('express').Router(); // express 모듈에서 Router 함수 가져옴

router.post('/register', register);

module.exports = router;
