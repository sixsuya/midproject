// 각자 자신이 구현하는 기능에 맞게 파일을 추가하기, 대신 파일명에 어떤 기능인지 알기 쉽게 영문으로 적어주는 걸 권장
// export하고 같은 경로의 svc.js에서 require부분에 해당 폴더 경로를 추가해주기

// service에서 필요에 따라 db에 접속 => mapper
// mapper 가져오기
const query = require("../database/mapper/mapper.js");
require("dotenv").config({ path: "./dbConfig.env" });

const nodemailer = require("nodemailer");

//    1. 메일 설정
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
//    2. 인증번호 생성 함수
function generateAuthNumber() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
//    3. 메일 발송 함수
async function sendAuthMail(email, code) {

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: "swpark9659@naver.com",  //  테스트 용 (실제 사용 시 입력 이메일로 발송)
        subject: "인증번호 안내",
        html: `
            <h3>인증번호 안내 ${email}</h3>
            <p>인증번호 : <b>${code}</b></p>
            <p>3분 내에 입력해주세요.</p>
        `
    });
}

//    4. 인증번호 저장 + 메일 발송 (공통 함수)
async function createAndSendVerification(email, m_no, purpose) {

    const code = generateAuthNumber();

    // DB에 인증정보 저장
    await query("insertVerification", [
        email,
        m_no,      // 회원가입일 경우 null 가능
        code,
        purpose
    ]);

    // 메일 발송
    await sendAuthMail(email, code);

    return { message: "인증번호가 발송되었습니다." };
}
// ------------ 전역 함수 -------------


// ------------ 이메일 인증 서비스 -------------
const svc = {
    //    5. 회원가입 이메일 인증
    sendJoinMail: async (email) => {

    // 회원가입은 아직 m_no가 없을 수 있으므로 null
    return await createAndSendVerification(email, null, "i0_10");
},

//    6. 아이디 찾기 인증번호 발송
sendFindIdMail: async (name, email) => {

    const result = await query("selectMemberByNameEmail", [name, email]);

    if (!result || result.length == 0) {
        throw new Error("일치하는 회원 정보가 없습니다.");
    }

    const member = result[0];

    return await createAndSendVerification(email, member.m_no, "i0_20");
},

//    7. 비밀번호 재설정 인증번호 발송
sendResetPwMail: async (id, email) => {

    const result = await query("selectMemberByIdEmail", [id, email]);

    if (!result || result.length == 0) {
        throw new Error("일치하는 회원 정보가 없습니다.");
    }

    const member = result[0];

    return await createAndSendVerification(email, member.m_no, "i0_30");
},

//    8. 인증번호 검증
verifyCode: async (email, code, purpose) => {

    const result = await query(
        "selectValidVerification",
        [email, code, purpose]
    );

    if (!result || result.length == 0) {
        throw new Error("인증번호가 올바르지 않거나 만료되었습니다.");
    }

    const verifiRow = result[0];
    const m_no = verifiRow.m_no;

    // 성공 처리 (verifi_success = 'h0_10')
    await query("updateVerificationSuccess", [
        email,
        code,
        purpose
    ]);

    const res = { message: "인증 성공" };
    if (purpose === "i0_20" && m_no) {
        const member = await query("selectMemberByMno", [m_no]);
        if (member && member[0]) res.m_id = member[0].m_id;
    }
    if (purpose === "i0_30" && m_no) {
        res.m_no = m_no;
    }
    return res;
},

//    9. 비밀번호 변경 (m_no로)
updatePassword: async (m_no, newPw) =>{

    await query("updateMemberPassword", [newPw, m_no]);

    return { message: "비밀번호가 변경되었습니다." };
},

//    10. 비밀번호 재설정 (id, email로 회원 찾아서 변경)
resetPasswordByIdEmail: async (id, email, newPw) => {

    const result = await query("selectMemberByIdEmail", [id, email]);
    if (!result || result.length == 0) {
        throw new Error("일치하는 회원 정보가 없습니다.");
    }
    const member = result[0];
    await query("updateMemberPassword", [newPw, member.m_no]);
    return { message: "비밀번호가 변경되었습니다." };
},
}

module.exports = svc;