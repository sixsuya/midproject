<script setup>
/**
 * 지원계획 페이지.
 * 지원(support) 단위로 계획 목록 조회, 계획 추가/수정/임시저장, 승인요청·승인·보완·반려, 취소 요청 등을 처리한다.
 */
// ========== import ==========
import { ref, reactive, computed, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useSupportStore } from "../store/support.js";
import SupportPlanHeader from "./support/SupportPlanHeader.vue";
import SupportPlanDetail from "./support/SupportPlanDetail.vue";
import ReasonModal from "./modal/ReasonModal.vue";
import ConfirmModal from "./modal/ConfirmModal.vue";
import AlertModal from "./modal/AlertModal.vue";
import { getAlertPreset } from "../utils/alertPresets.js";

// ========== 변수 ==========
const route = useRoute();
const router = useRouter();
const supportCode = route.params.supportCode; // URL의 지원코드

const supportStore = useSupportStore();
const { planData, infoData } = storeToRefs(supportStore); // 계획 목록, 지원 기본정보
const { supportPlanDetail, insertPlan, updatePlan, decidePlan, fetchResultListForPlan } =
  supportStore;

const showAddPlanForm = ref(false); // 계획 추가 폼 표시 여부
const addForm = reactive({
  // 계획 추가 폼 입력값 (제목, 내용, 시작일, 종료일)
  title: "",
  content: "",
  startDate: "",
  endDate: "",
});
const addPlanFiles = ref([]); // 추가 폼에서 선택된 파일 목록
const addPlanFileInput = ref(null); // 숨겨진 file input ref
/** 추가 폼 파일 선택 input 변경 시 addPlanFiles 갱신 (10MB 초과 시 AlertModal로 에러 표시) */
function onPlanFileChange(e) {
  const files = Array.from(e.target.files || []);
  const oversized = files.filter((f) => f.size > 10 * 1024 * 1024);
  if (oversized.length > 0) {
    showAlert(
      "error",
      "알림",
      `파일 용량이 10MB를 초과합니다:\n${oversized
        .map((f) => f.name)
        .join("\n")}`,
    );
    if (addPlanFileInput.value) addPlanFileInput.value.value = "";
    return;
  }
  addPlanFiles.value = files;
}
/** 숨겨진 파일 input 클릭 → 파일 선택 다이얼로그 오픈 */
function openPlanFileDialog() {
  if (addPlanFileInput.value) addPlanFileInput.value.click();
}
/** 선택된 파일명을 콤마로 이어 붙인 표시용 문자열 */
const addPlanFileNames = computed(() =>
  addPlanFiles.value.length
    ? addPlanFiles.value.map((f) => f.name).join(", ")
    : "",
);

const reasonModal = ref({
  // 반려/보완 사유 모달 상태 (show, type, planCode, planCmt)
  show: false,
  type: "reject",
  planCode: null,
  planCmt: "",
});
const cancelModal = ref({ show: false, context: "add", planCode: null }); // 취소 확인 모달 상태
const cancelRequestPlanCode = ref(null); // 취소 확인 후 알림용으로 넘긴 plan_code
const approvalConfirm = ref({ show: false, source: "add", payload: null }); // 승인요청 확인 모달 상태

const alertModal = ref({
  // 단순 알림 모달 상태
  show: false,
  type: "success",
  title: "알림",
  message: "",
});
/** 결과 0건 시 알림 닫은 뒤 '결과를 작성하시겠습니까?' 확인 모달용 */
const pendingNoResultConfirm = ref(false);
const noResultPlanCode = ref(null);
const noResultConfirmModal = ref({ show: false });

// ========== 함수 ==========
/** 알림 모달을 띄운다. (조회 완료/성공 메시지는 표시하지 않음) */
function showAlert(type, title, message) {
  const m = (message ?? "").trim();
  if (!m || m === "조회 완료" || m === "조회 성공") return;
  alertModal.value = { show: true, type, title, message: m };
}
/** 알림 모달을 닫는다. (결과 0건 플로우면 이어서 확인 모달 오픈) */
function closeAlertModal() {
  alertModal.value.show = false;
  if (pendingNoResultConfirm.value) {
    pendingNoResultConfirm.value = false;
    noResultConfirmModal.value = { show: true };
  }
}

/** 계획 추가 폼을 열거나 닫고, 닫을 때 입력값을 비운다. */
function toggleAddPlan() {
  showAddPlanForm.value = !showAddPlanForm.value;
  if (!showAddPlanForm.value) {
    addForm.title = "";
    addForm.content = "";
    addForm.startDate = "";
    addForm.endDate = "";
    addPlanFiles.value = [];
  }
}

/** 반려/보완 사유 모달을 연다. */
function openReasonModal(type, planCode, planCmt) {
  reasonModal.value = { show: true, type, planCode, planCmt: planCmt ?? "" };
}
/** 반려/보완 사유 모달을 닫는다. */
function closeReasonModal() {
  reasonModal.value = { ...reasonModal.value, show: false };
}

/** 취소 확인 모달을 연다. (context: 'add' | 'detail', planCode) */
function openCancelModal(context, planCode = null) {
  cancelModal.value = { show: true, context, planCode };
}
/** 취소 확인 모달을 닫는다. */
function closeCancelModal() {
  cancelModal.value = { show: false, context: "add", planCode: null };
}
/** 취소 확인 모달에서 확인 시: 추가 폼이면 폼만 닫고, 상세 취소면 취소 완료 알림 후 모달 닫기 */
function onCancelModalConfirm() {
  if (cancelModal.value.context === "add") {
    showAddPlanForm.value = false;
    addForm.title = "";
    addForm.content = "";
    addForm.startDate = "";
    addForm.endDate = "";
  } else {
    cancelRequestPlanCode.value = cancelModal.value.planCode;
    showAlert("success", "알림", "수정이 취소되었습니다.");
  }
  closeCancelModal();
}
/** 취소 요청 완료 후 알림용 plan_code를 초기화한다. */
function clearCancelRequest() {
  cancelRequestPlanCode.value = null;
}

/** 승인요청 확인 모달을 닫는다. */
function closeApprovalConfirm() {
  approvalConfirm.value = { show: false, source: "add", payload: null };
}

/** 수정이력 버튼. 현재는 구현 중 알림만 */
function updHistory() {
  showAlert("error", "알림", "구현 중입니다.");
}
/** 지원결과 페이지로 이동한다. 0건이면 현재 페이지에서 알림→확인 모달 후, '네'일 때만 이동·폼 오픈 */
async function result(planCode) {
  const list = await fetchResultListForPlan(supportCode, planCode);
  if (list.length === 0) {
    showAlert("error", "알림", "지원결과가 존재하지 않습니다.");
    pendingNoResultConfirm.value = true;
    noResultPlanCode.value = planCode;
    return;
  }
  router.push({
    name: "SupportResult",
    params: { supportCode },
    query: planCode ? { planCode } : {},
  });
}
/** 결과 0건 확인 모달 '네' → 결과 화면으로 이동 후 추가 폼 열기 */
function onNoResultConfirmYes() {
  const planCode = noResultPlanCode.value;
  noResultConfirmModal.value = { show: false };
  noResultPlanCode.value = null;
  router.push({
    name: "SupportResult",
    params: { supportCode },
    query: planCode ? { planCode, openAddForm: "1" } : { openAddForm: "1" },
  });
}
function closeNoResultConfirm() {
  noResultConfirmModal.value = { show: false };
  noResultPlanCode.value = null;
}
/** 실제 파일을 서버에 업로드한다. DB INSERT + 물리 파일 저장을 한 번에 처리. */
async function uploadFilesToServer(files, filePath, categoryPk, uploadMem) {
  for (const f of files) {
    const formData = new FormData();
    formData.append("file", f);
    formData.append("file_path", filePath);
    formData.append("file_category", categoryPk);
    if (uploadMem) formData.append("upload_mem", uploadMem);
    try {
      await fetch("/api/upload/file-content", {
        method: "POST",
        body: formData,
      });
    } catch (e) {
      console.error("파일 업로드 중 에러", e);
    }
  }
}

/** SupportPlanDetail 컴포넌트 ref를 plan_code 기준으로 보관 (첨부파일 재조회용) */
const planDetailRefs = {};
function setPlanDetailRef(planCode, el) {
  if (el) planDetailRefs[planCode] = el;
  else delete planDetailRefs[planCode];
}
// 아래 두 함수는 현재 미사용 스텁 (추후 구현 예정)
function onCancel() {
  console.log("취소");
}
function onAddPlan() {
  console.log("계획추가");
}

/** 특정 계획에 대해 반려/보완 사유 모달을 연다. */
function openReasonModalForPlan(type, planCode) {
  openReasonModal(type, planCode, "");
}
/** 계획을 승인(e0_10) 처리한다. */
async function onApprove(planCode) {
  const res = await decidePlan(planCode, "e0_10", null);
  if (res?.retCode === "Success") {
    await supportPlanDetail(supportCode);
    const p = getAlertPreset("approvalComplete", "plan");
    showAlert(p.type, p.title, res.retMsg ?? p.message);
  } else if (res != null)
    showAlert("error", "알림", res.retMsg ?? "처리 중 오류가 발생했습니다.");
}
/** 보완 사유 모달을 연다. */
function supple(planCode) {
  openReasonModalForPlan("supple", planCode);
}
/** 반려 사유 모달을 연다. */
function reject(planCode) {
  openReasonModalForPlan("reject", planCode);
}
/** 반려/보완 사유 확인 시 decidePlan 호출 후 목록 갱신·알림 */
async function onReasonConfirm(reason) {
  const { planCode, type } = reasonModal.value;
  const decision = type === "reject" ? "e0_99" : "e0_80";
  const res = await decidePlan(planCode, decision, reason);
  closeReasonModal();
  if (res?.retCode === "Success") {
    await supportPlanDetail(supportCode);
    const presetKey =
      decision === "e0_99" ? "rejectComplete" : "suppleComplete";
    const p = getAlertPreset(presetKey, "plan");
    showAlert(p.type, p.title, res.retMsg ?? p.message);
  } else if (res != null)
    showAlert("error", "알림", res.retMsg ?? "처리 중 오류가 발생했습니다.");
}

/** 추가 폼에서 승인요청 확인 모달을 연다. */
function onApprovalRequestFromAdd() {
  approvalConfirm.value = { show: true, source: "add", payload: null };
}
/** 상세에서 승인요청 시 확인 모달을 연다. */
function onApprovalRequest(payload) {
  approvalConfirm.value = { show: true, source: "detail", payload };
}
/** 승인요청 확인 모달에서 확인: 추가면 insertPlan, 상세면 updatePlan 후 목록 갱신·알림 */
async function onApprovalConfirmYes() {
  if (approvalConfirm.value.source === "add") {
    const { title, content, startDate, endDate } = addForm;
    closeApprovalConfirm();
    const res = await insertPlan(supportCode, {
      dsbl_no: infoData?.dsbl_no ?? null,
      plan_goal: title?.trim() ?? "",
      plan_content: content?.trim() ?? "",
      start_date: startDate || null,
      end_date: endDate || null,
    });
    if (res?.retCode === "Success") {
      // 첨부파일이 있으면 업로드 (DB INSERT + 물리 파일 저장 한 번에)
      const newPlanCode = res?.plan_code ?? null;
      if (newPlanCode && addPlanFiles.value.length > 0) {
        await uploadFilesToServer(
          addPlanFiles.value,
          "plan",
          newPlanCode,
          infoData?.mgr_no ?? null,
        );
      }
      await supportPlanDetail(supportCode);
      showAddPlanForm.value = false;
      addForm.title = "";
      addForm.content = "";
      addForm.startDate = "";
      addForm.endDate = "";
      addPlanFiles.value = [];
      const p = getAlertPreset("approvalRequestComplete", "plan");
      showAlert(p.type, p.title, res.retMsg ?? p.message);
    } else if (res != null) {
      showAlert("error", "알림", res.retMsg ?? "등록 중 오류가 발생했습니다.");
    } else {
      showAlert("error", "알림", "승인요청에 실패했습니다.");
    }
  } else {
    const payload = approvalConfirm.value.payload;
    closeApprovalConfirm();
    if (payload) {
      const res = await updatePlan(payload.planCode, {
        plan_goal: payload.title,
        plan_content: payload.content,
      });
      if (res?.retCode === "Success") {
        await supportPlanDetail(supportCode);
        const p = getAlertPreset("approvalRequestComplete", "plan");
        showAlert(p.type, p.title, res.retMsg ?? p.message);
      }
    }
  }
}
/** 상세 수정 완료 시 updatePlan 호출 후 목록 갱신 */
async function onEditComplete(payload) {
  if (!payload?.planCode) return;
  const res = await updatePlan(payload.planCode, {
    plan_goal: payload.title ?? "",
    plan_content: payload.content ?? "",
  });
  if (res?.retCode === "Success") {
    // 첨부파일 삭제/추가 처리
    const codesToDelete = Array.isArray(payload.deleteFileCodes)
      ? payload.deleteFileCodes
      : payload.deleteFile && payload.fileCode
        ? [payload.fileCode]
        : [];
    if (codesToDelete.length > 0) {
      try {
        await Promise.all(
          codesToDelete.map((code) =>
            fetch(`/api/upload/file/${encodeURIComponent(code)}`, {
              method: "DELETE",
            }),
          ),
        );
      } catch (e) {
        console.error("계획 첨부파일 삭제 호출 중 에러", e);
      }
    }
    if (Array.isArray(payload.newFiles) && payload.newFiles.length > 0) {
      await uploadFilesToServer(
        payload.newFiles,
        "plan",
        payload.planCode,
        infoData?.mgr_no ?? null,
      );
    }
    await supportPlanDetail(supportCode);
    const detail = planDetailRefs[payload.planCode];
    if (detail?.reloadFiles) {
      await detail.reloadFiles();
    }
  } else if (res != null) {
    showAlert("error", "알림", res.retMsg ?? "수정 중 오류가 발생했습니다.");
  }
}
/** 임시저장 버튼 (추가 폼). */
function onTempSaveFromAdd() {
  showAlert("error", "알림", "구현 중입니다.");
}
/** 상세(수정)에서 임시저장 버튼. */
function onTempSaveFromDetail() {
  showAlert("error", "알림", "구현 중입니다.");
}
/** 임시저장 불러오기 버튼. */
function onLoadTemp() {
  showAlert("error", "알림", "구현 중입니다.");
}

// ========== 라이프사이클 훅 ==========
// 마운트 전 해당 지원(supportCode)의 계획 목록 최초 조회
onBeforeMount(() => {
  supportPlanDetail(supportCode);
});
</script>
<template>
  <div class="container-fluid py-4">
    <h5 class="mb-3">지원계획</h5>
    <SupportPlanHeader
      :target_name="infoData?.target_name ?? ''"
      :member_name="infoData?.member_name ?? ''"
      :manager_name="infoData?.manager_name ?? ''"
      :priority="infoData?.priority ?? ''"
      :write_date="infoData?.write_date ?? ''"
      :disability_type="infoData?.disability_type ?? ''"
    />
    <div class="d-flex justify-content-end gap-2 mb-2">
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary"
        @click="onLoadTemp"
      >
        임시저장 불러오기
      </button>
      <button
        type="button"
        class="btn btn-sm btn-outline-primary"
        @click="toggleAddPlan"
      >
        계획추가
      </button>
    </div>
    <!-- 계획 추가 폼: 제목, 내용, 지원기간(시작일~종료일), 첨부 -->
    <div v-if="showAddPlanForm" class="card shadow-sm border-radius-lg mb-4">
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label text-sm text-body mb-1">제목</label>
          <input
            v-model="addForm.title"
            type="text"
            class="form-control form-control-sm"
            placeholder="지원 계획 제목"
          />
        </div>
        <div class="mb-3">
          <label class="form-label text-sm text-body mb-1">내용</label>
          <textarea
            v-model="addForm.content"
            class="form-control form-control-sm support-plan-textarea"
            placeholder="계획"
          ></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label text-sm text-body mb-1">지원기간</label>
          <div class="d-flex align-items-center flex-wrap gap-2">
            <input
              v-model="addForm.startDate"
              type="date"
              class="form-control form-control-sm"
              style="max-width: 11rem"
            />
            <span class="text-body">~</span>
            <input
              v-model="addForm.endDate"
              type="date"
              class="form-control form-control-sm"
              style="max-width: 11rem"
            />
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label text-sm text-body mb-1">첨부파일</label>
          <input
            ref="addPlanFileInput"
            type="file"
            class="d-none"
            multiple
            @change="onPlanFileChange"
          />
          <button
            type="button"
            class="form-control form-control-sm text-start bg-white"
            @click="openPlanFileDialog"
          >
            <span v-if="addPlanFileNames">{{ addPlanFileNames }}</span>
            <span v-else class="text-muted">파일을 선택하세요</span>
          </button>
        </div>
        <div class="d-flex justify-content-end gap-2">
          <button
            type="button"
            class="btn btn-sm btn-secondary"
            @click="onTempSaveFromAdd"
          >
            임시저장
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline-primary"
            @click="onApprovalRequestFromAdd"
          >
            승인요청
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            @click="openCancelModal('add')"
          >
            취소
          </button>
        </div>
      </div>
    </div>
    <SupportPlanDetail
      v-for="item in planData ?? []"
      :key="item.plan_code"
      :ref="(el) => setPlanDetailRef(item.plan_code, el)"
      :plan_code="item.plan_code"
      :support_plan_title="item.plan_goal"
      :support_plan_content="item.plan_content"
      :support_plan_file="item.origin_file_name"
      :file_code="item.file_code"
      :support_plan_updday="item.plan_updday"
      :support_plan_tf="item.plan_tf"
      :support_plan_comment="item.plan_cmt"
      :plan_date="item.plan_date"
      @history="updHistory"
      @result="result"
      @edit-complete="onEditComplete"
      @approve="onApprove"
      @supple="supple"
      @reject="reject"
      :cancel-request="cancelRequestPlanCode"
      @cancel-done="clearCancelRequest"
      @approval-request="onApprovalRequest"
      @request-cancel="(planCode) => openCancelModal('edit', planCode)"
      @temp-save="onTempSaveFromDetail"
      @cancel="onCancel"
      @add-plan="onAddPlan"
      :plan_result="item.plan_tf"
      @alert="(p) => showAlert(p.type ?? 'error', '알림', p.message ?? '')"
    />
    <ConfirmModal
      :show="approvalConfirm.show"
      title="승인 요청"
      message="지원 계획 승인 요청을 하시겠습니까?"
      @close="closeApprovalConfirm"
      @confirm="onApprovalConfirmYes"
    />
    <ConfirmModal
      :show="cancelModal.show"
      title="지원 계획 취소"
      message="작성 중인 지원 계획을 취소하시겠습니까?"
      warning-message="임시저장 되지 않은 계획은 삭제 시 복구가 불가합니다."
      @close="closeCancelModal"
      @confirm="onCancelModalConfirm"
    />
    <ConfirmModal
      :show="noResultConfirmModal.show"
      title="알림"
      message="결과를 작성하시겠습니까?"
      @close="closeNoResultConfirm"
      @confirm="onNoResultConfirmYes"
    />
    <ReasonModal
      :show="reasonModal.show"
      :type="reasonModal.type"
      :title-override="
        reasonModal.type === 'reject' ? '반려 사유' : '보완 사유'
      "
      :display-content="reasonModal.planCmt"
      @close="closeReasonModal"
      @confirm="onReasonConfirm"
    />
    <AlertModal
      :show="alertModal.show"
      :type="alertModal.type"
      :title="alertModal.title"
      :message="alertModal.message"
      @close="closeAlertModal"
    />
  </div>
</template>
<style scoped>
.support-plan-textarea {
  height: 6rem;
  min-height: 6rem;
  max-height: 6rem;
  resize: none;
}
</style>
