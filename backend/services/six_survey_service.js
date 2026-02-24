const pools = require("../database/mapper/pools");
const surveySql = require("../database/sqls/six_survey_sql");

exports.getSurveyTree = async (sverCode) => {
  let conn;
  try {
    conn = await pools.getConnection();

    const rows = await conn.query(surveySql.selectSurveyTree, [sverCode]);

    const dataRows = Array.isArray(rows)
      ? rows.filter((r) => r && r.sver_code)
      : [];

    if (dataRows.length === 0) return null;

    const result = {
      sver_code: sverCode,
      sv_name: dataRows[0].sv_name,
      majors: [],
    };

    const majorMap = new Map();

    for (const r of dataRows) {
      if (!majorMap.has(r.major_code)) {
        majorMap.set(r.major_code, {
          major_code: r.major_code,
          major_name: r.major_name,
          subs: [],
          _subMap: new Map(),
        });
        result.majors.push(majorMap.get(r.major_code));
      }

      const major = majorMap.get(r.major_code);

      if (!major._subMap.has(r.sub_code)) {
        major._subMap.set(r.sub_code, {
          sub_code: r.sub_code,
          sub_name: r.sub_name,
          questions: [],
        });
        major.subs.push(major._subMap.get(r.sub_code));
      }

      major._subMap.get(r.sub_code).questions.push({
        q_code: r.q_code,
        q_no: Number(r.q_no),
        q_type: r.q_type,
        q_content: r.q_content,
      });
    }

    result.majors.forEach((m) => delete m._subMap);

    return result;
  } finally {
    if (conn) conn.release();
  }
};
