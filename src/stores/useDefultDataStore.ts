// useDefultDataStore.ts
import { defineStore } from 'pinia'

interface defultDataState {
  account:string,
  count: number
}

export const useDefultDataStore = defineStore({
  id: 'defultData',
  state: (): defultDataState => ({
    account: 'admin',
    count: 0
  }),
  actions: {
    increment() {
      console.log('increment')
      this.count++
    }
  }
})