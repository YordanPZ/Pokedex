import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
function Nav() {
  const navigate = useNavigate()
  const userName = useSelector((state) => state.userName)
  const handleNavigate = () => {
    if (userName.length !== 0) {
      navigate("/home")
    }
  }

  return (
    <nav className="header__nav">
      <div onClick={handleNavigate}>
        <img className="header__nav-logo" src="/PokemonLogo.svg" alt="logo" />
      </div>
    </nav>
  )
}

export default Nav
