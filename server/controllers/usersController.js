const User = require('../model/userModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // 아이디 중복 체크, 중복된 아이디라면 에러처리
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: 'Username already used', status: false });

    // 이메일 중복 체크, 중복된 이메일이라면 에러처리
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: 'Email already used', status: false });

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

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // username으로 사용자 찾음
    const user = await User.findOne({ username });

    // 사용자가 존재하지 않으면, 잘못된 사용자명 또는 비밀번호로 간주하고 해당 메시지와 상태를 반환
    if (!user)
      return res.json({
        msg: 'Incorrect username or password',
        status: false,
      });

    // 비밀번호의 유효성을 검사합니다. 입력된 password와 사용자의 password를 비교
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // 비밀번호가 유효하지 않으면, 잘못된 사용자명 또는 비밀번호로 간주하고 해당 메시지와 상태를 반환
    if (!isPasswordValid)
      return res.json({
        msg: 'Incorrect username or password',
        status: false,
      });

    // 사용자 객체에서 password 속성을 삭제
    // 일반적으로 보안상의 이유로, 사용자의 비밀번호를 클라이언트로부터 서버로 전송한 후에는 비밀번호를 저장하지 않는 것이 좋음
    delete user.password;

    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};
