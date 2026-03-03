const query = require("../database/mapper/mapper.js");

/**
 * 담당자 목록 (m_auth = a0_30)
 * @param {string} mAuth - 'a0_30'
 * @param {string|null} searchBy - m_nm | m_org | m_id
 * @param {string|null} searchValue - 검색어
 * @param {string|null} mOrgFilter - 기관관리자용: 동일 m_org 담당자만 (같은 소속기관만)
 */
exports.getManagersList = async (mAuth = "a0_30", searchBy = null, searchValue = null, mOrgFilter = null) => {
  const rows = await query("selectManagersWithOrgan", [mAuth]);
  let list = Array.isArray(rows) ? rows : [];
  if (mOrgFilter && String(mOrgFilter).trim()) {
    const org = String(mOrgFilter).trim();
    list = list.filter((r) => (r.m_org || "") === org);
  }
  if (!searchBy || !searchValue || typeof searchValue !== "string") {
    return list;
  }
  const val = searchValue.trim().toLowerCase();
  if (!val) return list;
  return list.filter((r) => {
    if (searchBy === "m_nm") return (r.m_nm || "").toLowerCase().includes(val);
    if (searchBy === "m_org") {
      const o = (r.organ_name || r.m_org || "").toLowerCase();
      return o.includes(val);
    }
    if (searchBy === "m_id") return (r.m_id || "").toLowerCase().includes(val);
    return true;
  });
};

/**
 * 담당자 프로필 수정 (m_nm, m_tel, m_email만, m_auth=a0_30)
 */
exports.updateManagerProfile = async (mNo, payload) => {
  const { m_nm, m_tel, m_email } = payload || {};
  const query = require("../database/mapper/mapper.js");
  await query("updateManagerProfile", [
    m_nm ?? "",
    m_tel ?? "",
    m_email ?? "",
    mNo,
  ]);
  return { ok: true };
};
