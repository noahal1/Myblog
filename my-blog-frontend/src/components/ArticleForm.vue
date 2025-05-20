<template>
  <v-form @submit.prevent="onSubmit" v-model="isFormValid" class="pa-6">
    <v-text-field
      v-model="form.title"
      label="文章标题"
      required
      variant="outlined"
      :rules="[v => !!v || '标题不能为空']"
      class="mb-4"
    />
    <v-textarea
      v-model="form.summary"
      label="文章摘要"
      required
      variant="outlined"
      rows="3"
      class="mb-4"
      :rules="[v => !!v || '摘要不能为空']"
    />
    <MdEditor
      v-model="form.content"
      :theme="editorTheme"
      previewTheme="github"
      style="height: 400px"
      codeTheme="github"
      class="mb-4"
    />
    <v-autocomplete
      v-model="form.tags"
      :items="availableTags"
      item-title="name"
      item-value="id"
      label="文章标签"
      variant="outlined"
      chips
      multiple
      closable-chips
      class="mb-4"
      :loading="loadingTags"
      placeholder="选择相关标签"
    />
    <div class="d-flex justify-end">
      <v-btn color="primary" type="submit" :loading="loading" :disabled="!isFormValid">
        保存
      </v-btn>
    </div>
  </v-form>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { getTags } from '../api'
import { MdEditor } from 'md-editor-v3'
import { useTheme } from 'vuetify'
import 'md-editor-v3/lib/style.css'

const props = defineProps({
  article: {
    type: Object,
    default: () => ({ title: '', content: '', summary: '', tags: [] })
  },
  loading: Boolean
})
const emit = defineEmits(['submit'])

const theme = useTheme()
const editorTheme = computed(() => theme.global.current.value.dark ? 'dark' : 'light')

const isFormValid = ref(false)
const loadingTags = ref(false)
const availableTags = ref([])

const form = ref({
  title: '',
  content: '',
  summary: '',
  tags: []
})

watch(() => props.article, (val) => {
  if (val) {
    form.value = {
      title: val.title || '',
      content: val.content || '',
      summary: val.summary || '',
      tags: val.tags || []
    }
  }
}, { immediate: true })

const fetchTags = async () => {
  loadingTags.value = true
  try {
    const res = await getTags()
    availableTags.value = res.data || []
  } catch (e) {
    availableTags.value = []
  } finally {
    loadingTags.value = false
  }
}

onMounted(fetchTags)

const onSubmit = () => {
  emit('submit', { ...form.value })
}
</script>
