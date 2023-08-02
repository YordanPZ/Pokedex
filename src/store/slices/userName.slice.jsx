import { createSlice } from "@reduxjs/toolkit"

export const userNameSlice = createSlice({
  name: "userName",
  initialState: null,
  reducers: {
    setUsername: (state, action) => {
      return action.payload
    }
  }
})

export const { setUsername } = userNameSlice.actions

export default userNameSlice.reducer
