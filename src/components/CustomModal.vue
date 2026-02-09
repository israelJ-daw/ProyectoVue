<template>
  <div v-if="uiStore.isModalOpen" class="modal-backdrop fade show" @click.self="close"></div>
  <div v-if="uiStore.isModalOpen" class="modal fade show d-block" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content border-0 shadow-lg">
        <div class="modal-header text-white" :class="headerClass">
          <h5 class="modal-title fw-bold">
            <i :class="iconClass" class="me-2"></i> {{ uiStore.modalTitle }}
          </h5>
          <button type="button" class="btn-close btn-close-white" @click="close" aria-label="Close"></button>
        </div>
        <div class="modal-body p-4">
          <p class="fs-5 text-secondary mb-0">{{ uiStore.modalMessage }}</p>
        </div>
        <div class="modal-footer border-0">
          <button type="button" class="btn btn-secondary px-4 rounded-pill" @click="close">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore();

const close = () => {
  uiStore.closeModal();
};

const headerClass = computed(() => {
  switch (uiStore.modalType) {
    case 'success': return 'bg-success';
    case 'error': return 'bg-danger';
    case 'warning': return 'bg-warning';
    default: return 'bg-primary';
  }
});

const iconClass = computed(() => {
  switch (uiStore.modalType) {
    case 'success': return 'bi bi-check-circle-fill';
    case 'error': return 'bi bi-exclamation-triangle-fill';
    case 'warning': return 'bi bi-exclamation-circle-fill';
    default: return 'bi bi-info-circle-fill';
  }
});
</script>

<style scoped>
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}
.modal {
  z-index: 1050;
}
.modal-content {
  border-radius: 15px;
  overflow: hidden;
}
</style>
