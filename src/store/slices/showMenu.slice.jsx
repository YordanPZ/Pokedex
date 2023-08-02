import { createSlice } from "@reduxjs/toolkit"

export const showMenuSlice = createSlice({
  name: "showMenu",
  initialState: false,
  reducers: {
    setShowMenu: (state,action) => {
      return action.payload
    }
  }
})

export const { setShowMenu } = showMenuSlice.actions

export default showMenuSlice.reducer
