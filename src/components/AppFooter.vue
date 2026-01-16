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
  padding: 2rem 1rem;
  margin-top: auto;
}

.footer-container {
  max-width: 72rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

@media (min-width: 768px) {
  .footer-container {
    flex-direction: row;
    justify-content: space-between;
  }
}

.footer-container p {
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-link {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--brand-500);
}
</style>
