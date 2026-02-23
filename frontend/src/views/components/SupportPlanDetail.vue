<script setup>
defineProps({
  member_role: { type: String, default: "" },
  support_plan_title: { type: String, default: "" },
  support_plan_content: { type: String, default: "" },
  support_plan_file: { type: String, default: "" },
  support_plan_reject_comment: { type: String, default: "" },
  plan_result: { type: String, default: "" },
});
const emit = defineEmits([
  "history",
  "result",
  "edit",
  "approve",
  "supple",
  "reject",
]);
</script>
<template>
  <div>
    <p>계획작성일시</p>
    <div>
      <span>제목</span>
      <input type="text" :value="support_plan_title" readonly />
      <span>내용</span>
      <textarea :value="support_plan_content" readonly></textarea>
      <span>첨부</span>
      <input type="file" :value="support_plan_file" readonly />
      <span v-if="plan_result === 'e0_99'">반려</span>
      <textarea
        v-if="plan_result === 'e0_99'"
        :value="support_plan_reject_comment"
        readonly
      ></textarea>
    </div>
    <div>
      <!-- 수정 이력은 기관관리자, 기관담당자, 지원자 모두 클릭 가능 -->
      <button
        v-if="
          member_role === 'a0_40' ||
          member_role === 'a0_30' ||
          member_role === 'a0_20'
        "
        type="button"
        @click="emit('history')"
      >
        수정이력
      </button>
      <!-- 결과조회는 기관관리자, 기관담당자, 지원자 모두 클릭 가능 -->
      <button
        v-if="
          member_role === 'a0_40' ||
          member_role === 'a0_30' ||
          member_role === 'a0_20'
        "
        type="button"
        @click="emit('result')"
      >
        결과조회
      </button>
      <!-- 수정은 기관관리자, 기관담당자만 가능하며, 동시에 계획판정의 값이 검토 및 보완일 때만 출력됨 -->
      <button
        v-if="
          (member_role === 'a0_40' || member_role === 'a0_30') &&
          (plan_result === 'e0_00' || plan_result === 'e0_80')
        "
        type="button"
        @click="emit('edit')"
      >
        수정
      </button>
      <!-- 승인 및 반려는 기관관리자만 가능하며, 동시에 계획판정의 값이 검토 및 보완일 때만 출력됨 -->
      <button
        v-if="
          member_role === 'a0_40' &&
          (plan_result === 'e0_00' || plan_result === 'e0_80')
        "
        type="button"
        @click="emit('approve')"
      >
        승인
      </button>
      <button
        v-if="
          member_role === 'a0_40' &&
          (plan_result === 'e0_00' || plan_result === 'e0_80')
        "
        type="button"
        @click="emit('supple')"
      >
        보완
      </button>
      <button
        v-if="
          member_role === 'a0_40' &&
          (plan_result === 'e0_00' || plan_result === 'e0_80')
        "
        type="button"
        @click="emit('reject')"
      >
        반려
      </button>
    </div>
    <!-- 결과값은 모두 조회가 가능하나, 승인 및 반려 여부가 정해지지 않았다면 출력X -->
    <span v-if="plan_result === 'e0_10' || plan_result === 'e0_99'">
      {{ plan_result }}
    </span>
  </div>
</template>
