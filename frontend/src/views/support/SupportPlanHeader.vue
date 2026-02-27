<script setup>
/**
 * 지원계획 상단 헤더.
 * 지원대상, 장애유형, 작성일자, 지원자, 담당자, 우선순위 등 지원 기본 정보를 테이블로 표시한다.
 */
// ========== import ==========
// (없음)

// ========== 변수 (props) ==========
// 부모에서 전달: 지원대상, 지원자, 담당자, 우선순위, 작성일자, 장애유형
defineProps({
  target_name: { type: String, default: "" },
  member_name: { type: String, default: "" },
  manager_name: { type: String, default: "" },
  priority: { type: String, default: "" },
  write_date: { type: String, default: "" },
  disability_type: { type: String, default: "" },
});
</script>
<template>
  <div class="support-plan-header card border mb-3">
    <div class="card-body p-0">
      <table class="table table-bordered mb-0">
        <tbody>
          <!-- 1행: 지원대상 / 장애유형 / 작성일자 -->
          <tr>
            <td class="bg-light fw-medium" style="width: 10%">지원대상</td>
            <td style="width: 23%">{{ target_name }}</td>
            <td class="bg-light fw-medium" style="width: 10%">장애유형</td>
            <td style="width: 23%">{{ disability_type }}</td>
            <td class="bg-light fw-medium" style="width: 10%">작성일자</td>
            <td style="width: 24%">{{ write_date }}</td>
          </tr>
          <!-- 2행: 지원자(사회복지사) / 담당자(관리자) / 우선순위 -->
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
  </div>
</template>

<style scoped>
.support-plan-header .table td {
  padding: 0.5rem 0.75rem;
  vertical-align: middle;
  border: 1px solid var(--bs-border-color) !important;
}
</style>
