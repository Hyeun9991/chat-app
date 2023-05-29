const User = require('../model/userModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // 아이디 중복 체크, 중복된 아이디라면 에러처리
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ message: 'Username already used', status: false });

    // 이메일 중복 체크, 중복된 이메일이라면 에러처리
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ message: 'Email already used', status: false });

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // User 모델을 사용해서 새로운 사용자 생성
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    // 응답에서 password 필드를 삭제
    delete user.password;

    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};
