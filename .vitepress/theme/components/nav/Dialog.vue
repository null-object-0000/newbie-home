<template>
  <Transition name="dialog-fade">
    <div v-if="modelValue" class="dialog-overlay" @click.self="handleOverlayClick">
      <div class="dialog-container" :class="{ 'dark-mode': isDark, 'light-mode': !isDark }" @click.stop>
        <!-- Header -->
        <div v-if="title || $slots.header" class="dialog-header">
          <div v-if="icon" class="dialog-icon-wrapper">
            <component :is="icon" :size="24" />
          </div>
          <h3 v-if="title" class="dialog-title">{{ title }}</h3>
          <slot name="header"></slot>
        </div>

        <!-- Content -->
        <div class="dialog-content">
          <p v-if="message" class="dialog-message">{{ message }}</p>
          <p v-if="subMessage" class="dialog-submessage">{{ subMessage }}</p>
          <slot></slot>
        </div>

        <!-- Actions -->
        <div class="dialog-actions">
          <button
            v-if="showCancel"
            class="dialog-button dialog-button-cancel"
            :class="{ 'dark-mode': isDark, 'light-mode': !isDark }"
            @click="handleCancel"
          >
            {{ cancelText }}
          </button>
          <button
            v-if="showConfirm"
            class="dialog-button dialog-button-confirm"
            :class="{ 'dark-mode': isDark, 'light-mode': !isDark }"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </button>
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

interface Props {
  modelValue: boolean
  title?: string
  message?: string
  subMessage?: string
  icon?: any
  showCancel?: boolean
  showConfirm?: boolean
  cancelText?: string
  confirmText?: string
  closeOnClickOverlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showCancel: true,
  showConfirm: true,
  cancelText: '取消',
  confirmText: '确认',
  closeOnClickOverlay: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': []
  'cancel': []
}>()

const { isDark } = useData()

const handleConfirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}

const handleOverlayClick = () => {
  if (props.closeOnClickOverlay) {
    emit('update:modelValue', false)
    emit('cancel')
  }
}
</script>

<style scoped>
/* 对话框遮罩层 */
.dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  padding: 16px;
}

/* 对话框容器 */
.dialog-container {
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: dialogSlideIn 0.3s ease-out;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

@keyframes dialogSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dark-mode.dialog-container {
  background-color: rgba(30, 41, 59, 0.95);
  border: 1px solid rgba(71, 85, 105, 0.5);
  color: #e2e8f0;
}

.light-mode.dialog-container {
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(226, 232, 240, 0.8);
  color: #1e293b;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .dialog-overlay {
    padding: 12px;
  }

  .dialog-container {
    max-width: 100%;
    max-height: 85vh;
    border-radius: 12px;
  }
}

/* 对话框头部 */
.dialog-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid;
  flex-shrink: 0;
}

.dark-mode .dialog-header {
  border-bottom-color: rgba(71, 85, 105, 0.5);
}

.light-mode .dialog-header {
  border-bottom-color: rgba(226, 232, 240, 0.8);
}

@media (max-width: 768px) {
  .dialog-header {
    padding: 16px 20px;
  }
}

.dialog-icon-wrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  flex-shrink: 0;
}

.dark-mode .dialog-icon-wrapper {
  background-color: rgba(251, 113, 133, 0.2);
  color: #fb7185;
}

.light-mode .dialog-icon-wrapper {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

@media (max-width: 768px) {
  .dialog-icon-wrapper {
    width: 40px;
    height: 40px;
  }
}

.dialog-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  flex: 1;
}

@media (max-width: 768px) {
  .dialog-title {
    font-size: 18px;
  }
}

/* 对话框内容 */
.dialog-content {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

@media (max-width: 768px) {
  .dialog-content {
    padding: 20px;
  }
}

.dialog-message {
  font-size: 15px;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

@media (max-width: 768px) {
  .dialog-message {
    font-size: 14px;
    line-height: 1.5;
  }
}

.dialog-submessage {
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
  opacity: 0.7;
}

.dark-mode .dialog-submessage {
  color: #94a3b8;
}

.light-mode .dialog-submessage {
  color: #64748b;
}

@media (max-width: 768px) {
  .dialog-submessage {
    font-size: 12px;
  }
}

/* 对话框操作按钮 */
.dialog-actions {
  display: flex;
  gap: 12px;
  padding: 16px 24px 24px;
  justify-content: flex-end;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .dialog-actions {
    padding: 12px 20px 20px;
    gap: 8px;
    flex-direction: column-reverse;
  }

  .dialog-actions .dialog-button {
    width: 100%;
  }
}

.dialog-button {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 80px;
}

@media (max-width: 768px) {
  .dialog-button {
    padding: 12px 20px;
    font-size: 15px;
    min-width: auto;
  }
}

.dialog-button-cancel {
  background-color: transparent;
  border: 1px solid;
}

.dark-mode.dialog-button-cancel {
  color: #94a3b8;
  border-color: rgba(71, 85, 105, 0.5);
}

.dark-mode.dialog-button-cancel:hover {
  background-color: rgba(71, 85, 105, 0.3);
  color: #cbd5e1;
}

.light-mode.dialog-button-cancel {
  color: #64748b;
  border-color: rgba(226, 232, 240, 0.8);
}

.light-mode.dialog-button-cancel:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #475569;
}

.dialog-button-confirm {
  color: white;
}

.dark-mode.dialog-button-confirm {
  background-color: #2563eb;
}

.dark-mode.dialog-button-confirm:hover {
  background-color: #3b82f6;
}

.light-mode.dialog-button-confirm {
  background-color: #3b82f6;
}

.light-mode.dialog-button-confirm:hover {
  background-color: #60a5fa;
}

.dialog-button:active {
  transform: scale(0.98);
}

/* 对话框过渡动画 */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-fade-enter-active .dialog-container,
.dialog-fade-leave-active .dialog-container {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter-from .dialog-container,
.dialog-fade-leave-to .dialog-container {
  transform: translateY(-20px) scale(0.95);
  opacity: 0;
}

/* 移动端优化：防止内容溢出 */
@media (max-width: 768px) {
  .dialog-container {
    margin: auto;
  }

  .dialog-content {
    -webkit-overflow-scrolling: touch;
  }
}
</style>
