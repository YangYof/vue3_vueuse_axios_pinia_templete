// src/types/shims-vue.d.ts
import { ComponentCustomProperties } from 'vue'
import { Store } from 'pinia'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store
  }
}
