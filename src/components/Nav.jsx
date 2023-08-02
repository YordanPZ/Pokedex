import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
function Nav() {
  const navigate = useNavigate()
  const userName = useSelector((state) => state.userName)
  const handleNavigate = () => { 
    if (userName) {
     navigate("/home")
    }
  }

  return (
    <nav className="header__nav">
      <div>
        <img onClick={handleNavigate} className="header__nav-logo" src="/PokemonLogo.svg" alt="logo" />
      </div>
    </nav>
  )
}

export default Nav
