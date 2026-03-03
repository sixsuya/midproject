const qry = {
  insertVerification: `
    INSERT INTO verification
    (verifi_mail, m_no, verifi_num,
      verifi_purpose, verifi_create_at,
      verifi_end_at, verifi_success)
    VALUES (?, ?, ?, ?, NOW(),
    DATE_ADD(NOW(), INTERVAL 3 MINUTE), 'h0_00')
  `,

  selectValidVerification: `
    SELECT *
    FROM verification
    WHERE verifi_mail = ?
    AND verifi_num = ?
    AND verifi_purpose = ?
    AND verifi_success = 'h0_00'
    AND NOW() <= verifi_end_at
    ORDER BY verifi_create_at DESC
    LIMIT 1
  `,
  updateVerificationSuccess: `
    UPDATE verification
    SET verifi_success = 'h0_10'
    WHERE verifi_mail = ?
    AND verifi_num = ?
    AND verifi_purpose = ?
  `,
  selectMemberByNameEmail: `
    SELECT *
    FROM member
    WHERE m_nm = ?
    AND m_email = ?
  `,

  selectMemberByIdEmail: `
    SELECT *
    FROM member
    WHERE m_id = ?
    AND m_email = ?
  `,

  updateMemberPassword: `
    UPDATE member
    SET m_pw = ?
    WHERE m_no = ?
  `,

  selectMemberByMno: `
    SELECT m_no, m_id, m_nm, m_email
    FROM member
    WHERE m_no = ?
  `,
};

module.exports = qry;
