<script setup>
/**
 * 샘플: 지원계획 상단 요약 컴포넌트
 * - views/components 에 두는 "한 덩어리 UI" 예시
 * - 부모(페이지)에서 props 로 데이터만 받아서 표시
 */
defineProps({
  summary: {
    type: Object,
    default: () => ({
      supportTarget: '',
      disabilityType: '',
      writeDate: '',
      applicant: '',
      manager: '',
      priority: '',
    }),
  },
});
</script>
<template>
  <div class="sample-support-plan-header">
    <table class="table">
      <tbody>
        <tr>
          <td>지원대상</td>
          <td>{{ summary.supportTarget }}</td>
          <td>장애유형</td>
          <td>{{ summary.disabilityType }}</td>
          <td>작성일자</td>
          <td>{{ summary.writeDate }}</td>
        </tr>
        <tr>
          <td>지원자</td>
          <td>{{ summary.applicant }}</td>
          <td>담당자</td>
          <td>{{ summary.manager }}</td>
          <td>우선순위</td>
          <td>{{ summary.priority }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.sample-support-plan-header .table {
  width: 100%;
  border-collapse: collapse;
}
.sample-support-plan-header td {
  padding: 0.5rem;
  border: 1px solid #dee2e6;
}
</style>
