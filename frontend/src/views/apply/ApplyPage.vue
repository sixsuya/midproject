<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

// ===== 상태 =====
const loading = ref(true);

// survey list + selected
const surveyList = ref([]);
const selectedSurveyCode = ref("");
const survey = ref(null);

const activeSubCode = ref(null);
const answers = ref({});

// 작성일
const writeDate = ref("");

// ===== computed =====
const activeSub = computed(() => {
  if (!survey.value || !activeSubCode.value) return null;
  for (const mj of survey.value.majors) {
    const found = mj.subs.find((s) => s.sub_code === activeSubCode.value);
    if (found) return found;
  }
  return null;
});

// ===== helpers =====
const setToday = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  writeDate.value = `${yyyy}-${mm}-${dd}`;
};

const loadSurveyTree = async (code) => {
  // code가 없으면 아무것도 안 함
  if (!code) return;

  const { data } = await axios.get(`/api/surveys/${code}`);
  survey.value = data;

  // 첫 소분류 선택
  const firstSub = data?.majors?.[0]?.subs?.[0];
  activeSubCode.value = firstSub?.sub_code ?? null;

  // 답변 초기화(원하면 유지 가능)
  answers.value = {};
};

// ===== 초기 로딩 =====
onMounted(async () => {
  try {
    setToday();

    // 1) survey 목록
    const listRes = await axios.get("/api/surveys");
    surveyList.value = listRes.data || [];

    if (surveyList.value.length === 0) {
      // 설문이 하나도 없으면 화면에 메시지
      survey.value = null;
      return;
    }

    // 2) 첫 번째 설문 자동 선택
    selectedSurveyCode.value = surveyList.value[0].sver_code;

    // 3) 선택된 설문 트리 로드
    await loadSurveyTree(selectedSurveyCode.value);
  } catch (err) {
    console.error(err);
    survey.value = null;
  } finally {
    loading.value = false;
  }
});

// ===== 저장/취소 =====
const onSave = () => {
  alert("저장(더미): 아직 DB 저장은 하지 않습니다.");
  console.log("selectedSurveyCode:", selectedSurveyCode.value);
  console.log("writeDate:", writeDate.value);
  console.log("answers:", answers.value);
};

const onCancel = () => {
  alert("취소(더미)");
};
</script>

<template>
  <div class="py-4 container-fluid">
    <div v-if="loading" class="text-center text-muted py-5">불러오는 중...</div>

    <div
      v-else-if="surveyList.length === 0"
      class="text-center text-muted py-5"
    >
      등록된 조사지가 없습니다. (survey 테이블 확인)
    </div>

    <div v-else-if="!survey" class="text-center text-danger py-5">
      조사지 데이터를 불러오지 못했습니다.
    </div>

    <div v-else class="row">
      <!-- 좌측(간단 버전): 조사지 선택 -->
      <div class="col-lg-3 mb-4">
        <div class="card">
          <div class="card-header pb-0">
            <h6 class="mb-0">조사지 선택</h6>
          </div>

          <div class="card-body">
            <label class="form-label text-sm">조사지</label>

            <select
              class="form-select form-select-sm"
              v-model="selectedSurveyCode"
              @change="loadSurveyTree(selectedSurveyCode)"
            >
              <option
                v-for="s in surveyList"
                :key="s.sver_code"
                :value="s.sver_code"
              >
                {{ s.sv_name }} ({{ s.sver_code }})
              </option>
            </select>

            <hr class="horizontal dark my-3" />

            <div class="text-xs text-muted">
              * DB 값이 변경되어도 목록에서 최신 데이터를 자동 선택합니다.
            </div>
          </div>
        </div>
      </div>

      <!-- 우측: 조사지 문항 -->
      <div class="col-lg-9">
        <div class="card">
          <div class="card-header pb-0">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="mb-0">지원신청 하기</h6>

              <!-- 작성일 -->
              <div class="d-flex align-items-center gap-2">
                <span class="text-sm">작성일</span>
                <div class="input-group input-group-sm" style="width: 180px">
                  <span class="input-group-text">
                    <i class="ni ni-calendar-grid-58"></i>
                  </span>
                  <input type="date" class="form-control" v-model="writeDate" />
                </div>
              </div>
            </div>
          </div>

          <div class="card-body pt-3">
            <!-- 소분류 버튼 -->
            <div class="mb-3 d-flex flex-wrap gap-2">
              <template v-for="mj in survey.majors" :key="mj.major_code">
                <button
                  v-for="sb in mj.subs"
                  :key="sb.sub_code"
                  class="btn btn-sm mb-0"
                  :class="
                    activeSubCode === sb.sub_code
                      ? 'btn-warning'
                      : 'btn-outline-secondary'
                  "
                  @click="activeSubCode = sb.sub_code"
                >
                  {{ sb.sub_name }}
                </button>
              </template>
            </div>

            <hr class="horizontal dark my-3" />

            <!-- 문항 -->
            <div v-if="!activeSub" class="text-muted text-sm">
              항목을 선택하세요.
            </div>

            <div v-else>
              <h6 class="mb-3">{{ activeSub.sub_name }}</h6>

              <div
                v-for="q in activeSub.questions"
                :key="q.q_code"
                class="d-flex align-items-center justify-content-between py-2 border-bottom"
              >
                <div class="d-flex align-items-start gap-2">
                  <div class="text-sm text-muted" style="width: 20px">
                    {{ q.q_no }}
                  </div>
                  <div class="text-sm">
                    {{ q.q_content }}
                  </div>
                </div>

                <!-- 예/아니오 기본 -->
                <div class="d-flex align-items-center gap-3">
                  <label class="mb-0 d-flex align-items-center gap-1 text-sm">
                    <input
                      type="radio"
                      :name="q.q_code"
                      value="Y"
                      v-model="answers[q.q_code]"
                    />
                    예
                  </label>
                  <label class="mb-0 d-flex align-items-center gap-1 text-sm">
                    <input
                      type="radio"
                      :name="q.q_code"
                      value="N"
                      v-model="answers[q.q_code]"
                    />
                    아니오
                  </label>
                </div>
              </div>
            </div>

            <!-- 하단 버튼 -->
            <div class="d-flex justify-content-end gap-2 mt-4">
              <button class="btn btn-warning mb-0" @click="onSave">저장</button>
              <button class="btn btn-outline-secondary mb-0" @click="onCancel">
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- /우측 -->
    </div>
  </div>
</template>
