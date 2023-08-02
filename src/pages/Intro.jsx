import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setUsername } from "../store/slices/userName.slice"
import "./Intro.css"

const Intro = () => {
  const navigate = useNavigate() 
  const userName = useSelector((state) => state.userName)
  const dispatch = useDispatch()
  const [input, setInput] = useState("")
  const savedUser = JSON.parse(localStorage.getItem("user"))?.userName //peticion por si hay usuaruio guardado

  if (savedUser?.length > 1) {
    //si hay usuario que me redirija
    navigate("/home")
  }

  const handleInput = () => {
    
    dispatch(setUsername(input))//Guardar en el estado global el nombre de usuario
    const user = JSON.stringify({ userName: input }) //crear un objeto con el nombre de usuario
    localStorage.setItem("user", user) // mandar al localstorage el objeto con el nombre de usuario
  }

  if (userName) navigate("/home") //si hay un nombre de usuario que me redirija a la pagina home

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
            <form onSubmit={handleInput}>
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
                    onClick={handleInput}
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
