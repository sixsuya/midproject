// 각자 자신이 구현하는 기능에 맞게 파일을 추가하기, 대신 파일명에 어떤 기능의 라우터인지 알기 쉽게 영문으로 적어주는 걸 권장
// export하고 같은 경로의 router.js에서 require부분에 해당 폴더 경로를 추가해주기
// 라우터 통합은 조금 까다로우니까 router.js 파일 잘 확인하기

const express = require("express");
const router = express.Router();

const verifi = require("../services/svc.js");

/* ============================
   1. 회원가입 이메일 인증번호 발송
   POST /verification/join
   body: { email }
============================ */
router.post("/join", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "이메일을 입력하세요." });
        }

        const result = await verifi.sendJoinMail(email);

        res.json(result);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ============================
   2. 아이디 찾기 인증번호 발송
   POST /verification/find-id
   body: { name, email }
============================ */
router.post("/find-id", async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: "이름과 이메일을 입력하세요." });
        }

        const result = await verifi.sendFindIdMail(name, email);

        res.json(result);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/* ============================
   3. 비밀번호 재설정 인증번호 발송
   POST /verification/reset-pw
   body: { id, email }
============================ */
router.post("/reset-pw", async (req, res) => {
    try {
        const { id, email } = req.body;

        if (!id || !email) {
            return res.status(400).json({ message: "아이디와 이메일을 입력하세요." });
        }

        const result = await verifi.sendResetPwMail(id, email);

        res.json(result);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/* ============================
   4. 인증번호 검증
   POST /verification/verify
   body: { email, code, purpose }
============================ */
router.post("/verify", async (req, res) => {
    try {
        const { email, code, purpose } = req.body;

        if (!email || !code || !purpose) {
            return res.status(400).json({ message: "필수 값이 누락되었습니다." });
        }

        const result = await verifi.verifyCode(email, code, purpose);

        res.json(result);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/* ============================
   5. 비밀번호 변경 (m_no 사용)
   POST /verifi/update-password
   body: { m_no, newPw }
============================ */
router.post("/update-password", async (req, res) => {
    try {
        const { m_no, newPw } = req.body;

        if (!m_no || !newPw) {
            return res.status(400).json({ message: "필수 값이 누락되었습니다." });
        }

        const result = await verifi.updatePassword(m_no, newPw);

        res.json(result);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ============================
   6. 비밀번호 재설정 (id, email 사용 - 인증 완료 후 호출)
   POST /verifi/reset-password
   body: { id, email, newPw }
============================ */
router.post("/reset-password", async (req, res) => {
    try {
        const { id, email, newPw } = req.body;

        if (!id || !email || !newPw) {
            return res.status(400).json({ message: "아이디, 이메일, 새 비밀번호를 모두 입력하세요." });
        }

        const result = await verifi.resetPasswordByIdEmail(id, email, newPw);

        res.json(result);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;