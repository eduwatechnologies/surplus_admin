import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type AuthState = {
  user: {
    id?: string
    name?: string
    email?: string
    role?: string
  } | null
  status: "idle" | "loading" | "authenticated" | "error"
  error: string | null
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState["user"]>) => {
      state.user = action.payload
      state.status = action.payload ? "authenticated" : "idle"
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { setUser, clearError } = authSlice.actions
export default authSlice.reducer
