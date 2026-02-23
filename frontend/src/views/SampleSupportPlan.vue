<script setup>
/**
 * 샘플: "이렇게 만들면 된다" 페이지 예시
 * - 페이지(views)에서는 레이아웃 + 데이터 + 이벤트 처리만 담당
 * - UI 덩어리는 views/components 의 컴포넌트로 분리해서 사용
 */
import SampleSupportPlanHeader from './components/SampleSupportPlanHeader.vue';
import SampleSupportPlanDetail from './components/SampleSupportPlanDetail.vue';

// 페이지에서만 쓰는 데이터 (API 등에서 가져온다고 가정)
const summary = {
  supportTarget: '샘플 대상',
  disabilityType: '샘플 유형',
  writeDate: '2025-02-20',
  applicant: '홍길동',
  manager: '김담당',
  priority: '상',
};

const detail = {
  planDate: '2025-02-20 14:00',
  title: '샘플 계획 제목',
  content: '샘플 계획 내용입니다.',
  rejectReason: '',
  resultText: '',
};

// 컴포넌트에서 올라온 이벤트는 페이지에서 처리
function onHistory() {
  console.log('수정이력 클릭');
}
function onResult() {
  console.log('결과조회 클릭');
}
function onEdit() {
  console.log('수정 클릭');
}
function onApprove() {
  console.log('승인 클릭');
}
function onReject() {
  console.log('반려 클릭');
}
</script>
<template>
  <div class="py-4 container-fluid">
    <h5 class="mb-3">[샘플] 지원계획 페이지 — 이렇게 조합하면 됩니다</h5>

    <!-- 1) 상단 요약: 컴포넌트에 데이터만 넘김 -->
    <SampleSupportPlanHeader :summary="summary" />

    <!-- 2) 상세 + 버튼: 컴포넌트에 데이터 넘기고, 클릭은 emit 으로 받음 -->
    <SampleSupportPlanDetail
      :plan-date="detail.planDate"
      :title="detail.title"
      :content="detail.content"
      :reject-reason="detail.rejectReason"
      :result-text="detail.resultText"
      @history="onHistory"
      @result="onResult"
      @edit="onEdit"
      @approve="onApprove"
      @reject="onReject"
    />
  </div>
</template>
