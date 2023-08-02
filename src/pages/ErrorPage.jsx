import React from "react"
import "./ErrorPage.css"
import { useNavigate } from "react-router-dom"

function ErrorPage() {
  const navigate = useNavigate()

  const redirec = () => {
    navigate("/home")
  }
  return (
    <main className="error-page">
      <img src="/error.svg" alt="" />
      <div>
        <button onClick={redirec} className="btn-regresar">
          Regresar
        </button>
      </div>
    </main>
  )
}

export default ErrorPage
