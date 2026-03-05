<script setup>
/**
 * 샘플: 지원계획 상세 + 액션 버튼 컴포넌트
 * - views/components 에 두는 "한 덩어리 UI" 예시
 * - props 로 표시할 데이터, emit 으로 버튼 클릭 알림
 */
defineProps({
  planDate: { type: String, default: "" },
  title: { type: String, default: "" },
  content: { type: String, default: "" },
  rejectReason: { type: String, default: "" },
  resultText: { type: String, default: "" },
});

const emit = defineEmits(["history", "result", "edit", "approve", "reject"]);
</script>
<template>
  <div class="sample-support-plan-detail">
    <p>계획작성일시: {{ planDate }}</p>
    <div class="detail-fields">
      <span>제목</span>
      <input type="text" :value="title" readonly />
      <span>내용</span>
      <textarea readonly :value="content"></textarea>
      <span>첨부</span>
      <input type="file" readonly />
      <span>반려</span>
      <textarea readonly :value="rejectReason"></textarea>
    </div>
    <div class="actions">
      <button type="button" @click="emit('history')">수정이력</button>
      <button type="button" @click="emit('result')">결과조회</button>
      <button type="button" @click="emit('edit')">수정</button>
      <button type="button" @click="emit('approve')">승인</button>
      <button type="button" @click="emit('reject')">반려</button>
    </div>
    <span>결과값: {{ resultText }}</span>
  </div>
</template>

<style scoped>
.sample-support-plan-detail .detail-fields {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.sample-support-plan-detail .actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.sample-support-plan-detail button {
  padding: 0.25rem 0.75rem;
}
</style>
