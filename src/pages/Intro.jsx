import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setUsername } from "../store/slices/userName.slice"
import "./Intro.css"

const Intro = () => {
  const navigate = useNavigate()
  const userName = useSelector((state) => state.userName)
  const dispatch = useDispatch()
  const [input, setInput] = useState("")
  const savedUser = JSON.parse(localStorage.getItem("user"))?.userName

  const handleInput = () => {
    dispatch(setUsername(input))
    const user = JSON.stringify({ userName: input })
    localStorage.setItem("user", user)
  }

  useEffect(() => {
    // Redirigir al usuario si ya hay un nombre de usuario o si se encuentra uno en el local storage
    if (userName || savedUser) {
      navigate("/home")
    }
  }, [userName, savedUser, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    handleInput()
  }

  return (
    <>
      <main className="main__intro">
        <div className="main__logos">
          <img
            className="main__logos-pokeball"
            src="/Pokeball.svg"
            alt="pokeball"
          />
          <img
            className="main__logos-pikachu"
            src="./Pikachu.svg"
            alt="pikachu"
          />
          <img
            className="main__logos-pokeball1"
            src="./PokeBall1.svg"
            alt="pokabalblack"
          />
          <img className="main__logos-cloud" src="./Cloud.svg" alt="cloud" />
          <img className="main__logos-cloud2" src="./Cloud.svg" alt="cloud" />
        </div>
        <section className="section__intro">
          <p className="section__intro-title">
            <b>Find</b> all your favorite <b>Pokemons</b>
          </p>
          <div className="container">
            <form onSubmit={handleSubmit}>
              <div className="search-container">
                <input
                  placeholder="Username"
                  type="text"
                  className="input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit" className="not">
                  <img
                    src="/Pokeball.svg"
                    alt="pokeball"
                    className="search__icon"
                  />
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  )
}

export default Intro
