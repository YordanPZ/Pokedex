import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { setUsername } from "../store/slices/userName.slice"
import { useDispatch } from "react-redux"
const LogOut = () => {
  const [isLogOut, setIsLogOut] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleRedirect = () => {
    dispatch(setUsername(null))
    localStorage.removeItem("user")
    navigate("/")
    setIsLogOut(false)
  }

  return (
    <>
      <button onClick={() => setIsLogOut(!isLogOut)} className="logout-btn">
        <i className="bx bx-log-out-circle"></i>
      </button>
      {isLogOut && (
        <div className="logout">
          <div className="logout-content">
            <h1>Log Out</h1>
            <p>Are you sure you want to log out?</p>
            <div className="buttons">
              <button className="cancel"  onClick={() => setIsLogOut(!isLogOut)}>Cancel</button>
              <button className="confirm"  onClick={handleRedirect}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LogOut
