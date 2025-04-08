import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    theme: localStorage.getItem('theme') || 'light',
    fontSize: localStorage.getItem('fontSize') || 'medium',
    codeHighlightTheme: localStorage.getItem('codeTheme') || 'github'
  }),
  
  actions: {
    setTheme(theme) {
      this.theme = theme
      localStorage.setItem('theme', theme)
    },
    
    setFontSize(size) {
      this.fontSize = size
      localStorage.setItem('fontSize', size)
    },
    
    setCodeTheme(theme) {
      this.codeHighlightTheme = theme
      localStorage.setItem('codeTheme', theme)
    }
  }
}) 