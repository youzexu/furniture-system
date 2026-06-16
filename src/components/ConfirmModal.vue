<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)

function show() { visible.value = true }
function hide() { visible.value = false }
function confirm() { emit('confirm'); hide() }

defineExpose({ show, hide })

const emit = defineEmits<{ confirm: [] }>()
withDefaults(defineProps<{ icon?: string; title?: string; text?: string }>(), {
  icon: '🗑️', title: '确认操作', text: '确定要执行此操作吗？此操作不可撤销。'
})
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click.self="hide">
      <div class="modal-card">
        <span class="modal-icon">{{ icon }}</span>
        <h3>{{ title }}</h3>
        <p>{{ text }}</p>
        <div class="modal-actions">
          <button class="btn-danger" @click="confirm">确认</button>
          <button class="btn-cancel" @click="hide">取消</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay { position:fixed; inset:0; z-index:300; background:rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; padding:40px; }
.modal-card { background:#fff; max-width:400px; width:100%; padding:44px 36px; text-align:center; }
.modal-icon { font-size:40px; display:block; margin-bottom:16px; }
.modal-card h3 { font-size:20px; font-weight:400; color:var(--dark); letter-spacing:4px; margin-bottom:10px; font-family:'Noto Serif SC',serif; }
.modal-card p { font-size:13px; color:var(--text-muted); line-height:1.7; margin-bottom:28px; }
.modal-actions { display:flex; gap:12px; justify-content:center; }
.btn-danger { padding:12px 28px; background:#c00; color:#fff; border:none; font-size:13px; letter-spacing:2px; cursor:pointer; font-family:inherit; transition:background .3s; }
.btn-danger:hover { background:#a00; }
.btn-cancel { padding:12px 28px; border:1px solid #ddd; background:#fff; color:var(--text-light); font-size:13px; letter-spacing:2px; cursor:pointer; font-family:inherit; transition:all .3s; }
.btn-cancel:hover { border-color:#333; }
</style>
