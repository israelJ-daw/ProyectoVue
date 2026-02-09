import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    isModalOpen: false,
    modalTitle: '',
    modalMessage: '',
    modalType: 'info' // 'info', 'success', 'warning', 'error'
  }),
  actions: {
    showModal(title, message, type = 'info') {
      this.modalTitle = title;
      this.modalMessage = message;
      this.modalType = type;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    }
  }
});
