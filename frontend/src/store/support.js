import { ref } from "vue";
import { defineStore } from "pinia";

export const useSupportStore = defineStore("support", () => {
  const detail = ref([]);
  const supportPlanDetail = async (supportCode) => {
    let supportPlanDetailInfo = await fetch(`/support/${supportCode}`)
      .then((res) => res.json())
      .catch((err) => console.error(`지원계획 조회 중 에러 발생\n`, err));
    detail.value = supportPlanDetailInfo;
  };
  return { detail, supportPlanDetail };
});
