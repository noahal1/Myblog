<template>
  <svg 
    width="32" 
    height="32" 
    viewBox="0 0 80 80" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- 背景圆形 -->
    <circle cx="40" cy="40" r="36" fill="#3f51b5" />
    
    <!-- 书本形状 -->
    <path 
      d="M 24 25 L 24 55 C 24 58 32 58 40 55 C 48 58 56 58 56 55 L 56 25 C 56 22 48 22 40 25 C 32 22 24 22 24 25 Z" 
      fill="#ffffff" 
      opacity="0.95"
    />
    
    <!-- 书页 -->
    <path 
      d="M 40 25 L 40 55" 
      stroke="#3f51b5" 
      stroke-width="2" 
      stroke-linecap="round"
    />
    
    <!-- 书签 -->
    <path 
      d="M 50 23 L 50 35 L 46 32 L 42 35 L 42 23 Z" 
      fill="#ff913d" 
    />
    
    <!-- N字母 (Noah的首字母) -->
    <path 
      d="M 30 50 L 30 42 L 36 48 L 36 40" 
      stroke="#3f51b5" 
      stroke-width="2.5" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      fill="none"
    />
  </svg>
</template> 