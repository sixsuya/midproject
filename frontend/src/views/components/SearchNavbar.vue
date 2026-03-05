<script setup>
defineProps({
  title: { type: String, default: "상세 검색" },
  subtitle: { type: String, default: "" },
});

const emit = defineEmits(["search", "reset"]);
</script>

<template>
  <div class="col-lg-3 mb-4">
    <div class="card">
      <div class="card-header pb-0">
        <div class="d-flex justify-content-between align-items-center">
          <h6 class="mb-0">{{ title }}</h6>
        </div>
        <p v-if="subtitle" class="text-xs text-muted mb-0 mt-1">
          {{ subtitle }}
        </p>
      </div>

      <form class="card-body" @submit.prevent="emit('search')">
        <!-- 필터 입력 영역 -->
        <slot />

        <!-- 검색 / 초기화 버튼 -->
        <div class="mt-4 d-grid gap-2">
          <button type="submit" class="btn btn-success mb-0">검색</button>
          <button
            type="button"
            class="btn btn-outline-secondary mb-0"
            @click="emit('reset')"
          >
            초기화
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
