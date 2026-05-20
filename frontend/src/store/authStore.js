import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (user, token) => {
        localStorage.setItem('token', token)
        localStorage.setItem('userId', user._id)
        set({ user, token, isAuthenticated: true, isLoading: false })
      },

      setUser: (user) => set({ user }),

      logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        set({ user: null, token: null, isAuthenticated: false, isLoading: false })
      },

      setLoading: (isLoading) => set({ isLoading }),

      updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    },
  ),
)
