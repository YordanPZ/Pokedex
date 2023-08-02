import { configureStore } from "@reduxjs/toolkit"
import userName from "./slices/userName.slice"
import showMenu from "./slices/showMenu.slice"

export default configureStore({
  reducer: {
    userName,
    showMenu
  }
})
