<script setup>
/**
 * 지원결과 상단 헤더.
 * 지원대상·장애유형·작성일자·지원자·담당자·우선순위 등 지원 정보와 선택된 계획(plan) 정보를 테이블로 표시한다.
 */
// ========== import ==========
import { ref } from "vue";

// ========== 변수 (props) ==========
// 부모에서 전달: 지원 기본정보 + 선택된 계획(plan_code, plan_date, organ_name, plan_goal, 기간·첨부파일)
const props = defineProps({
  target_name: { type: String, default: "" },
  member_name: { type: String, default: "" },
  manager_name: { type: String, default: "" },
  priority: { type: String, default: "" },
  write_date: { type: String, default: "" },
  disability_type: { type: String, default: "" },
  plan_code: { type: String, default: "" },
  plan_date: { type: String, default: "" },
  organ_name: { type: String, default: "" },
  plan_goal: { type: String, default: "" },
  plan_content: { type: String, default: "" },
  plan_start_time: { type: String, default: "" },
  plan_end_time: { type: String, default: "" },
  plan_file_name: { type: String, default: "" },
});

const showContent = ref(false); // 계획 내용(plan_content) 행 표시 여부
/** 계획 목표(plan_goal) 셀 클릭 시 내용 행을 토글로 열고 닫는다. */
function toggleContent() {
  showContent.value = !showContent.value;
}
</script>
<template>
  <div class="support-plan-header card border mb-3">
    <!-- 지원 기본정보 (infoData): 지원대상, 장애유형, 작성일자, 지원자, 담당자, 우선순위 -->
    <div class="card-body p-0">
      <table class="table table-bordered mb-0">
        <tbody>
          <tr>
            <td class="bg-light fw-medium" style="width: 10%">지원대상</td>
            <td style="width: 23%">{{ target_name }}</td>
            <td class="bg-light fw-medium" style="width: 10%">장애유형</td>
            <td style="width: 23%">{{ disability_type }}</td>
            <td class="bg-light fw-medium" style="width: 10%">작성일자</td>
            <td style="width: 24%">{{ write_date }}</td>
          </tr>
          <tr>
            <td class="bg-light fw-medium">지원자</td>
            <td>{{ member_name }}</td>
            <td class="bg-light fw-medium">담당자</td>
            <td>{{ manager_name }}</td>
            <td class="bg-light fw-medium">우선순위</td>
            <td>{{ priority }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 간격 -->
    <div class="space-20"></div>
    <!-- 선택된 계획 정보 (planData): NO, 작성일자, 작성자, 소속기관, 목표, 기간, 첨부파일 -->
    <div class="card-body p-0">
      <table class="table table-bordered mb-0 plan-data-table">
        <tbody>
          <tr>
            <td class="bg-light fw-medium" style="width: 15%">NO</td>
            <td class="bg-light fw-medium" style="width: 15%">작성일자</td>
            <td class="bg-light fw-medium" style="width: 15%">작성자</td>
            <td class="bg-light fw-medium" style="width: 15%">소속기관</td>
            <td class="bg-light fw-medium plan-goal-header">
              목표
            </td>
          </tr>
          <tr>
            <td class="bg-light fw-medium">{{ plan_code?.slice(-4) }}</td><!-- plan_code 마지막 4자리를 NO로 표시 -->
            <td class="bg-light fw-medium">{{ plan_date }}</td>
            <td class="bg-light fw-medium">{{ manager_name }}</td>
            <td class="bg-light fw-medium">{{ organ_name }}</td>
            <!-- plan_goal 셀 클릭 시 내용 행 토글 -->
            <td class="bg-light fw-medium plan-goal-cell" @click="toggleContent">
              {{ plan_goal }}
            </td>
          </tr>
          <!-- 내용 행: plan_goal 클릭 시 토글로 표시/숨김 -->
          <tr v-if="showContent">
            <td class="bg-light fw-medium">내용</td>
            <td class="text-start" colspan="4">
              {{ props.plan_content || "-" }}
            </td>
          </tr>
          <tr>
            <td class="bg-light fw-medium">시작일</td>
            <td class="text-center" colspan="2">
              {{ plan_start_time || "-" }}
            </td>
            <td class="bg-light fw-medium">종료일</td>
            <td class="text-center">
              {{ plan_end_time || "-" }}
            </td>
          </tr>
          <tr v-if="plan_file_name">
            <td class="bg-light fw-medium">첨부파일</td>
            <td class="text-start" colspan="4">
              {{ plan_file_name }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.support-plan-header .table td {
  padding: 0.5rem 0.75rem;
  vertical-align: middle;
  border: 1px solid var(--bs-border-color) !important;
}
.space-20 {
  margin: 20px 0;
}
.support-plan-header .plan-data-table td {
  text-align: center;
}
.plan-goal-cell {
  cursor: pointer;
}
</style>
