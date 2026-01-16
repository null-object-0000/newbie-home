<template>
  <footer class="site-footer">
    <div class="footer-container">
      <p>© 2026 Newbie Space. Built with Vue 3 & Vite.</p>
      <div class="footer-links">
        <a href="https://github.com/null-object-0000" target="_blank" class="footer-link">GitHub</a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// 页脚组件，无需额外逻辑
</script>

<style scoped>
/* ========== 页脚 ========== */
.site-footer {
  border-top: 1px solid var(--border-color);
  padding: 1.5rem 1rem;
  margin-top: auto;
}

@media (min-width: 640px) {
  .site-footer {
    padding: 2rem 1.5rem;
  }
}

@media (min-width: 1024px) {
  .site-footer {
    padding: 2rem 2rem;
  }
}

.footer-container {
  max-width: 72rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
  text-align: center;
}

@media (min-width: 640px) {
  .footer-container {
    font-size: 0.875rem;
  }
}

@media (min-width: 768px) {
  .footer-container {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }
}

.footer-container p {
  margin: 0;
  line-height: 1.5;
}

.footer-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

@media (min-width: 768px) {
  .footer-links {
    justify-content: flex-end;
    gap: 1.5rem;
  }
}

.footer-link {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s;
  padding: 0.25rem 0;
  min-height: 2rem;
  display: inline-flex;
  align-items: center;
  touch-action: manipulation;
}

.footer-link:hover,
.footer-link:active {
  color: var(--brand-500);
}
</style>
