<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

// ===== 상태 =====
const loading = ref(true);
const survey = ref(null);
const activeSubCode = ref(null);
const answers = ref({});

// ===== API 호출 =====
onMounted(async () => {
  try {
    const { data } = await axios.get("/api/surveys/testcode");
    survey.value = data;

    const firstSub = data?.majors?.[0]?.subs?.[0];
    activeSubCode.value = firstSub?.sub_code ?? null;
  } catch (err) {
    console.error(err);
    survey.value = null;
  } finally {
    loading.value = false;
  }
});

// ===== 현재 선택된 소분류 =====
const activeSub = computed(() => {
  if (!survey.value || !activeSubCode.value) return null;

  for (const mj of survey.value.majors) {
    const found = mj.subs.find((s) => s.sub_code === activeSubCode.value);
    if (found) return found;
  }
  return null;
});

// ===== 제출 버튼 =====
const submit = () => {
  console.log("answers:", answers.value);
  alert("콘솔 확인하세요");
};
</script>

<template>
  <div class="py-4 container-fluid">
    <!-- 로딩 -->
    <div v-if="loading" class="text-center text-muted py-5">
      조사지 불러오는 중...
    </div>

    <!-- 에러 -->
    <div v-else-if="!survey" class="text-center text-danger py-5">
      조사지 데이터를 불러오지 못했습니다.
    </div>

    <!-- 정상 화면 -->
    <div v-else class="row">
      <!-- 좌측: 대분류/소분류 -->
      <div class="col-lg-3 mb-4">
        <div class="card">
          <div class="card-header pb-0">
            <h6 class="mb-0">{{ survey.sv_name }}</h6>
          </div>

          <div class="card-body">
            <div v-for="mj in survey.majors" :key="mj.major_code" class="mb-3">
              <div class="fw-semibold text-sm mb-2">
                {{ mj.major_name }}
              </div>

              <div class="d-flex flex-column gap-2">
                <button
                  v-for="sb in mj.subs"
                  :key="sb.sub_code"
                  class="btn btn-sm mb-0 text-start"
                  :class="
                    activeSubCode === sb.sub_code
                      ? 'btn-warning'
                      : 'btn-outline-secondary'
                  "
                  @click="activeSubCode = sb.sub_code"
                >
                  {{ sb.sub_name }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 우측: 문항 -->
      <div class="col-lg-9">
        <div class="card">
          <div class="card-header pb-0">
            <h6 class="mb-0">
              {{ activeSub?.sub_name || "항목 선택" }}
            </h6>
          </div>

          <div class="card-body pt-3">
            <div v-if="!activeSub" class="text-muted text-sm">
              좌측에서 항목을 선택하세요.
            </div>

            <div v-else>
              <!-- 문항 반복 -->
              <div
                v-for="q in activeSub.questions"
                :key="q.q_code"
                class="mb-4"
              >
                <div class="fw-semibold text-sm mb-2">
                  {{ q.q_no }}. {{ q.q_content }}
                </div>

                <!-- TEXT -->
                <input
                  v-if="q.q_type === 'TEXT'"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="answers[q.q_code]"
                />

                <!-- LONG -->
                <textarea
                  v-else-if="q.q_type === 'LONG'"
                  class="form-control form-control-sm"
                  rows="3"
                  v-model="answers[q.q_code]"
                ></textarea>

                <!-- RADIO -->
                <div
                  v-else-if="q.q_type === 'RADIO'"
                  class="d-flex flex-column gap-2"
                >
                  <label>
                    <input
                      type="radio"
                      :name="q.q_code"
                      value="1"
                      v-model="answers[q.q_code]"
                    />
                    1번 선택
                  </label>

                  <label>
                    <input
                      type="radio"
                      :name="q.q_code"
                      value="2"
                      v-model="answers[q.q_code]"
                    />
                    2번 선택
                  </label>
                </div>

                <!-- 기본 -->
                <input
                  v-else
                  type="text"
                  class="form-control form-control-sm"
                  v-model="answers[q.q_code]"
                />
              </div>

              <!-- 버튼 -->
              <div class="d-flex justify-content-end gap-2">
                <button
                  class="btn btn-outline-secondary mb-0"
                  @click="alert('임시저장')"
                >
                  임시저장
                </button>

                <button class="btn btn-primary mb-0" @click="submit">
                  제출
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
