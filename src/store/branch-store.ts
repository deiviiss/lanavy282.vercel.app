// src/store/branch-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type Branch } from '@/lib/types'

interface BranchState {
  selectedBranch: Branch | null
  setSelectedBranch: (branch: Branch) => void
  clearBranch: () => void
}

export const useBranchStore = create<BranchState>()(
  persist(
    (set) => ({
      selectedBranch: null,
      setSelectedBranch: (branch) => { set({ selectedBranch: branch }) },
      clearBranch: () => { set({ selectedBranch: null }) }
    }),
    {
      name: 'branch-storage' // <- nombre en localStorage
    }
  )
)
