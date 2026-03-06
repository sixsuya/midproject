<script setup>
import { onBeforeMount, onBeforeUnmount, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/store/auth";

import Navbar from "@/examples/PageLayout/Navbar.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import FindIdModal from "@/views/modal/FindIdModal.vue";
import FindPasswordModal from "@/views/modal/FindPasswordModal.vue";
import SigninTitle from "./SigninTitle.vue";

// Vuex, Router
const store = useStore();
const router = useRouter();
const route = useRoute();
const body = document.body;

// 폼 입력 상태
const userId = ref("");
const password = ref("");

// 아이디/비밀번호 찾기 모달
const showFindIdModal = ref(false);
const showFindPasswordModal = ref(false);

// 라우터 이동 함수
const goToSignUp = () => router.push("/signup");
const goToFindId = () => {
  showFindIdModal.value = true;
};
const goToResetPassword = () => {
  showFindPasswordModal.value = true;
};

function onFindIdGoLogin() {
  showFindIdModal.value = false;
}
function onFindIdGoFindPassword() {
  showFindIdModal.value = false;
  showFindPasswordModal.value = true;
}
function onFindPasswordGoLogin() {
  showFindPasswordModal.value = false;
}

// 로그인 저장소 피니아
const authStore = useAuthStore();

// URL 쿼리로 모달 열기 (/find-id, /find-password 리다이렉트 대응)
onMounted(() => {
  const open = route.query.open;
  if (open === "find-id") showFindIdModal.value = true;
  else if (open === "find-password") showFindPasswordModal.value = true;
});

// 모달 상태
const showModal = ref(false);
const modalMessage = ref("");

// 로그인 처리
const handleLogin = async () => {
  if (!userId.value || !password.value) {
    alert("ID와 Password를 입력해주세요.");
    return;
  }

  try {
    const res = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ m_id: userId.value, m_pw: password.value }),
    });

    const data = await res.json();

    if (data.success) {
      switch (data.user.m_auth) {
        case "a0_21":
        case "a0_31":
        case "a0_41":
          modalMessage.value = "가입 승인 대기 상태입니다.";
          showModal.value = true;
          return; // 🔥 여기서 종료
      }
      // ✅ Pinia에 전체 user + token 저장
      authStore.setAuth({
        token: data.token,
        user: data.user,
      });

      // 새로고침 유지용(탭 단위): sessionStorage에는 항상 저장
      sessionStorage.setItem("token", data.token || "");
      sessionStorage.setItem("user", JSON.stringify(data.user));

      // alert("로그인 성공!");

      // ✅ 권한별 분기
      switch (data.user.m_auth) {
        case "a0_20":
          router.push("/applicant");
          break;

        case "a0_30":
          router.push("/manager");
          break;
        case "a0_40":
          router.push("/organmanager");
          break;

        case "a0_99":
          router.push("/admin");
          break;

        default:
          router.push("/");
      }
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("서버 오류가 발생했습니다.");
  }
};

// 페이지 진입/퇴장 시 UI 상태 처리
onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");
});

onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});
</script>

<template>
  <!-- Navbar (로그인 페이지에서는 숨김 가능) -->
  <div
    v-if="store.state.showNavbar"
    class="container top-0 position-sticky z-index-sticky"
  >
    <div class="row">
      <div class="col-12">
        <navbar
          isBlur="blur border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          v-bind:darkMode="true"
          isBtn="bg-gradient-success"
        />
      </div>
    </div>
  </div>

  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100 position-relative">
        <!-- 타이틀: 화면 왼쪽 위 고정 -->
        <div class="signin-title-wrap position-absolute top-0 start-0 m-3 m-md-4 z-index-2">
          <SigninTitle />
        </div>

        <div class="container pt-5 pt-lg-0">
          <div class="row">
            <!-- 로그인 카드: 기존 위치 유지 (오른쪽) -->
            <div
              class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column ms-auto me-lg-5 position-relative z-index-2"
            >
              <div class="card bg-white shadow-lg rounded-0 p-4">
                <div
                  class="pb-0 card-header text-start bg-transparent border-0"
                >
                  <h4 class="font-weight-bolder">안녕하세요</h4>
                  <p class="mb-0">로그인해주세요.</p>
                </div>

                <div class="card-body">
                  <form @submit.prevent="handleLogin">
                    <!-- ID -->
                    <div class="mb-3">
                      <label for="userid" class="form-label text-sm">ID</label>
                      <ArgonInput
                        v-model="userId"
                        id="userid"
                        type="text"
                        placeholder="ID"
                        name="userid"
                        size="lg"
                        class="rounded-0"
                      />
                    </div>

                    <!-- Password -->
                    <div class="mb-3">
                      <label for="password" class="form-label text-sm">비밀번호</label>
                      <ArgonInput
                        v-model="password"
                        id="password"
                        type="password"
                        placeholder="Password"
                        name="password"
                        size="lg"
                        class="rounded-0"
                      />
                    </div>

                    <!-- 로그인 버튼 -->
                    <ArgonButton
                      type="submit"
                      variant="gradient"
                      color="success"
                      fullWidth
                      size="lg"
                      class="rounded-0 py-2 mt-2 mb-4"
                    >
                      로그인
                    </ArgonButton>
                  </form>

                  <!-- 하단: 회원가입, 아이디찾기, 비밀번호 재설정 -->
                  <div class="d-flex flex-wrap justify-content-center gap-2 gap-md-3 pt-2 border-top">
                    <ArgonButton
                      type="button"
                      variant="outline"
                      color="success"
                      size="sm"
                      class="rounded-0"
                      @click="goToSignUp"
                    >
                      회원가입
                    </ArgonButton>
                    <ArgonButton
                      type="button"
                      variant="outline"
                      color="success"
                      size="sm"
                      class="rounded-0"
                      @click="goToFindId"
                    >
                      아이디 찾기
                    </ArgonButton>
                    <ArgonButton
                      type="button"
                      variant="outline"
                      color="success"
                      size="sm"
                      class="rounded-0"
                      @click="goToResetPassword"
                    >
                      비밀번호 재설정
                    </ArgonButton>
                  </div>
                </div>
              </div>
            </div>

            <!-- 배경 이미지 -->
            <div
              class="top-0 my-auto text-center col-12 d-lg-flex d-none h-100 ps-0 position-absolute start-0 justify-content-center flex-column"
            >
              <div
                class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="
                  background-image: url(&quot;https://www.ibabynews.com/news/photo/202108/96894_46682_4928.jpg&quot;);
                  background-size: cover;
                  background-repeat: no-repeat;
                  background-position: center;
                "
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- 아이디 찾기 / 비밀번호 재설정 모달 -->
    <FindIdModal
      :show="showFindIdModal"
      @close="showFindIdModal = false"
      @go-login="onFindIdGoLogin"
      @go-find-password="onFindIdGoFindPassword"
    />
    <FindPasswordModal
      :show="showFindPasswordModal"
      @close="showFindPasswordModal = false"
      @go-login="onFindPasswordGoLogin"
    />

    <!-- 모달: 알림 -->
    <div
      v-if="showModal"
      class="modal fade show d-block"
      style="background: rgba(0, 0, 0, 0.5); z-index: 9999"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-0 border-0 shadow-lg">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title font-weight-bolder">알림</h5>
          </div>
          <div class="modal-body py-4 text-center text-dark font-weight-bold">
            {{ modalMessage }}
          </div>
          <div class="modal-footer border-0 pt-0 justify-content-center">
            <ArgonButton
              type="button"
              color="success"
              variant="gradient"
              size="lg"
              class="rounded-0 px-5"
              @click="showModal = false"
            >
              확인
            </ArgonButton>
          </div>
        </div>
      </div>
    </div>

  </main>
</template>

