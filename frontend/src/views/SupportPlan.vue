<script setup>
// Component Import
import SupportPlanHeader from "./components/SupportPlanHeader.vue";
import SupportPlanDetail from "./components/SupportPlanDetail.vue";

// Vue Import
import { onBeforeMount } from "vue";

// Vue Router Import
import { useRoute } from "vue-router";
const route = useRoute();
const supportCode = route.params.supportCode;

// Store Import
import { useSupportStore } from "../store/support.js";
const supportStore = useSupportStore();

// Pinia Import
import { storeToRefs } from "pinia";
const { detail } = storeToRefs(supportStore);
const { supportPlanDetail } = supportStore;

onBeforeMount(() => {
  supportPlanDetail(supportCode);
});

// button event
function updHistory() {
  console.log("수정이력");
  // modal창 구현
}
function result() {
  console.log("결과조회");
  // modal창 구현
}
function edit() {
  console.log("수정");
  // 수정 기능 활성화
  // 수정완료 버튼 활성화
}
function approve() {
  console.log("승인");
  // modal창 구현
}
function supple() {
  console.log("보완");
}
function reject() {
  console.log("반려");
  // modal창 구현
}
</script>
<template>
  <SupportPlanHeader :summary="detail?.summary ?? {}" />
  <SupportPlanDetail
    v-for="item in (detail?.data ?? [])"
    :key="item.plan_code"
    :support_plan_title="item.plan_goal"
    :support_plan_content="item.plan_content"
    :support_plan_file="item.origin_file_name"
    :support_plan_reject_comment="item.plan_rej_cmt"
    @updHistory="updHistory"
    @result="result"
    @edit="edit"
    @approve="approve"
    @supple="supple"
    @reject="reject"
    :plan_result="item.plan_tf"
  />
</template>
<style></style>
