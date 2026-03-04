/**
 * useHistory.js
 * 수정이력(upd_history) 공통 composable
 * - 모달 열기/닫기 + 이력 조회
 * - 이력 INSERT (수정 성공 후 fire-and-forget)
 *
 * content / upd_content 포맷: JSON.stringify([{ field: "필드명", value: "값" }, ...])
 */
import { ref } from "vue";

export function useHistory() {
  const historyModal = ref({
    show: false,
    title: "",
    list: [],
    loading: false,
  });

  /** 수정이력 모달 열기 — API 조회 후 표시 */
  async function openHistoryModal(supCode, categoryName, title) {
    historyModal.value = { show: true, title: title ?? "수정이력", list: [], loading: true };
    if (!supCode?.trim()) {
      historyModal.value.loading = false;
      return;
    }
    try {
      const res = await fetch(
        `/api/history/support/${encodeURIComponent(supCode)}?category_name=${encodeURIComponent(categoryName)}`,
      );
      if (!res.ok) throw new Error("수정이력 조회 실패");
      const data = await res.json();
      historyModal.value.list = Array.isArray(data) ? data : [];
    } catch (e) {
      console.error("[useHistory] 수정이력 조회 실패:", e);
      historyModal.value.list = [];
    } finally {
      historyModal.value.loading = false;
    }
  }

  function closeHistoryModal() {
    historyModal.value.show = false;
  }

  /**
   * 수정이력 INSERT (fire-and-forget; 실패해도 사용자 흐름에 영향 없음)
   * @param {string} supCode - his_category (지원코드)
   * @param {string} categoryName - j0_10 | j0_20 | j0_30
   * @param {string} updTarget - plan_code | result_code 등
   * @param {string} updMember - 수정자 m_no
   * @param {Array<{field:string,value:string}>} beforeFields - 수정 전 필드 배열
   * @param {Array<{field:string,value:string}>} afterFields  - 수정 후 필드 배열
   */
  async function insertHistory(supCode, categoryName, { updTarget, updMember, beforeFields, afterFields }) {
    if (!supCode?.trim()) return;
    try {
      await fetch(`/api/history/support/${encodeURIComponent(supCode)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_name: categoryName,
          upd_member: updMember ?? "",
          upd_target: updTarget ?? "",
          content: JSON.stringify(Array.isArray(beforeFields) ? beforeFields : []),
          upd_content: JSON.stringify(Array.isArray(afterFields) ? afterFields : []),
        }),
      });
    } catch (e) {
      console.warn("[useHistory] 수정이력 INSERT 실패:", e);
    }
  }

  return {
    historyModal,
    openHistoryModal,
    closeHistoryModal,
    insertHistory,
  };
}
