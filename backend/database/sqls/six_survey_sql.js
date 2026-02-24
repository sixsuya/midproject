// backend/database/sqls/six_survey_sql.js

exports.selectSurveyTree = `
  SELECT
    s.sver_code,
    s.sv_name,
    mj.major_code,
    mj.major_name,
    sb.sub_code,
    sb.sub_name,
    q.q_code,
    q.q_no,
    q.q_type,
    q.q_content
  FROM survey s
  JOIN major_category mj ON mj.sver_code = s.sver_code
  JOIN sub_category sb ON sb.major_code = mj.major_code
  JOIN survey_q q ON q.sub_code = sb.sub_code
  WHERE s.sver_code = ?
  ORDER BY mj.major_code, sb.sub_code, q.q_no
`;
