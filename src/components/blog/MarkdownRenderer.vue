<template>
  <div class="markdown-body" v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMarkdown } from '@/composables/useMarkdown'

interface Props {
  content: string
}

const props = defineProps<Props>()

const { parseMarkdown } = useMarkdown()

const renderedHtml = computed(() => {
  const { html } = parseMarkdown(props.content)
  return html
})
</script>

<style>
.markdown-body {
  font-size: 16px;
  line-height: 1.8;
  color: var(--c-text-1);
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body h1 {
  font-size: 2em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--c-divider);
}

.markdown-body h2 {
  font-size: 1.5em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--c-divider);
}

.markdown-body h3 {
  font-size: 1.25em;
}

.markdown-body h4 {
  font-size: 1em;
}

.markdown-body p {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body a {
  color: var(--c-brand);
  text-decoration: none;
}

.markdown-body a:hover {
  text-decoration: underline;
}

.markdown-body img {
  max-width: 100%;
  border-radius: var(--radius);
  margin: 16px 0;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 2em;
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body li {
  margin-bottom: 4px;
}

.markdown-body blockquote {
  margin: 0;
  padding: 0 1em;
  color: var(--c-text-2);
  border-left: 4px solid var(--c-brand);
  margin-bottom: 16px;
}

.markdown-body pre {
  background: var(--c-bg-soft);
  border-radius: var(--radius);
  padding: 16px;
  overflow-x: auto;
  margin-bottom: 16px;
}

.markdown-body code {
  font-family: var(--font-family-mono);
  font-size: 0.875em;
  background: var(--c-bg-soft);
  padding: 0.2em 0.4em;
  border-radius: 4px;
}

.markdown-body pre code {
  background: transparent;
  padding: 0;
}

.markdown-body table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 16px;
}

.markdown-body th,
.markdown-body td {
  padding: 8px 12px;
  border: 1px solid var(--c-divider);
}

.markdown-body th {
  background: var(--c-bg-soft);
  font-weight: 600;
}

.markdown-body hr {
  height: 1px;
  border: none;
  background: var(--c-divider);
  margin: 24px 0;
}

.markdown-body sup {
  font-size: 0.75em;
}

.markdown-body .footnote-ref {
  color: var(--c-brand);
  text-decoration: none;
}

/* Image Gallery */
.markdown-body .image-gallery-wrapper {
  display: flex !important;
  gap: 10px !important;
  justify-content: center !important;
  flex-wrap: wrap !important;
  margin: 20px 0 !important;
  align-items: flex-start !important;
}

.markdown-body .image-gallery-wrapper img {
  max-height: 300px;
  width: auto;
  border-radius: var(--radius);
  cursor: pointer;
  transition: transform 0.3s;
  margin: 0;
}

.markdown-body .image-gallery-wrapper img:hover {
  transform: scale(1.02);
}

/* Timeline */
.markdown-body .timeline-wrapper {
  position: relative;
  padding-left: 24px;
  margin: 20px 0;
}

.markdown-body .timeline-wrapper::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--c-brand);
}

.markdown-body .timeline-wrapper ul {
  list-style: none;
  padding-left: 0;
}

.markdown-body .timeline-wrapper li {
  position: relative;
  margin-bottom: 12px;
  padding-left: 8px;
}

.markdown-body .timeline-wrapper li::before {
  content: '';
  position: absolute;
  left: -28px;
  top: 8px;
  width: 10px;
  height: 10px;
  background: var(--c-brand);
  border-radius: 50%;
  border: 2px solid var(--c-bg);
}
</style>
