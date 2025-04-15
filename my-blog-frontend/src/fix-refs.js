/**
 * Vue 3 Ref修复辅助工具
 * 
 * 这个文件提供了一些辅助函数，用于修复Vue 3中ref在模板中直接使用的问题。
 * 在Vue 3中，ref必须在setup函数内创建，不能直接在模板中使用。
 * 
 * 使用方法:
 * 1. 在组件中导入这个文件
 * 2. 使用wrapRefs包装所有需要传递给模板的ref
 * 
 * 示例:
 * const myRef = ref('value')
 * const wrappedRefs = wrapRefs({ myRef })
 * // 在模板中使用 wrappedRefs.myRef 而不是直接使用 myRef
 */

import { computed } from 'vue'

/**
 * 将ref包装成computed，确保在模板中安全使用
 * @param {Object} refs - 包含ref的对象
 * @returns {Object} - 包含computed的对象
 */
export function wrapRefs(refs) {
  const wrapped = {}
  
  for (const key in refs) {
    if (Object.prototype.hasOwnProperty.call(refs, key)) {
      wrapped[key] = computed(() => refs[key].value)
    }
  }
  
  return wrapped
}

/**
 * 创建一个安全的ref包装器
 * @param {*} initialValue - ref的初始值
 * @returns {Object} - 包含value的computed
 */
export function safeRef(ref) {
  return computed(() => ref.value)
}

/**
 * 创建一个具有双向绑定功能的包装器
 * @param {*} ref - 要包装的ref
 * @returns {Object} - 包含getter和setter的对象
 */
export function createBindingRef(ref) {
  return {
    get value() {
      return ref.value
    },
    set value(newValue) {
      ref.value = newValue
    }
  }
} 