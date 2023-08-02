import { useSelector } from "react-redux"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import PokemonList from "../components/PokemonList"
import { fetchData } from "../FetchData"
import LogOut from "../components/LogOut"
import colors from "../Colors"
import { Link } from "react-router-dom"
import Pagination from "@mui/material/Pagination"
import { useNavigate } from "react-router-dom"

const Home = () => {
  //*URL
  const urlInicialPokemons = "https://pokeapi.co/api/v2/pokemon/"
  const typesPokemon = "https://pokeapi.co/api/v2/type/"
  //*useState
  const [inicialInfo, setInicialInfo] = useState({}) //Primeros datos de los pokemones(sin imagenes)
  const [inicialPokemons, setInicialPokemons] = useState([]) //Datos de los pokemones completos(con imagenes)
  const [pokemonsLimit, setPokemonsLimit] = useState(9) //Limit de pokemons a mostrar
  const [pokemonType, setPokemonType] = useState("") //Tipos de pokemons
  const [pokemonTypeSelected, setPokemonTypeSelected] = useState(null) //Tipo de pokemon seleccionado
  const [currentPage, setCurrentPage] = useState(1) //Pagina a mostrar
  const inputValueRef = useRef(undefined) //Valor de la busqueda (UseRef para que no se renderize el componente con cada cambio)
  const navigate = useNavigate() //redireccionar para el buscardor por nombre
  //*Username
  const userName = useSelector((state) => state.userName) //Username a saludar
  const savedUser = JSON.parse(localStorage.getItem("user")).userName //Hacer la peticion al local storage para saludar con ese nombre

  useEffect(() => {
    //Axios que trae los datos de los pokemones (sin imagenes)
    axios
      .get(urlInicialPokemons)
      .then((res) => {
        setInicialInfo(res.data)
      })
      .catch((err) => console.log(err))

    //Axios que trae los tipos de los pokemones
    axios
      .get(typesPokemon)
      .then((res) => setPokemonType(res.data))
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    //Async & Await que trae los datos de los pokemones (con imagenes) (Async & Await para que no se dupliquen)
    setInicialPokemons([])
    fetchData(inicialInfo, setInicialPokemons)
  }, [inicialInfo])

  const lastIndex = currentPage * pokemonsLimit
  const firstIndex = lastIndex - pokemonsLimit

  //Si el usuario no selecciona ningun tipo de pokemon, se muestran todos los pokemons (los 20 iniciales)
  let pokemonsToShow
  if (pokemonTypeSelected === null) {
    pokemonsToShow = inicialPokemons.slice(firstIndex, lastIndex).map((e) => {
      const types = e.types.map((e) => e.type.name)
      const bst = e.stats.reduce((acc, stat) => {
        return acc + stat.base_stat
      }, 0)
      const color = colors[types[0]]

      return (
        <Link to={`/pokemon/${e.name}`} key={e.id}>
          <li
            style={{ background: color }}
            className="pokemon__card"
            key={e.id}
          >
            <div className="pokemon__card--container">
              <h3 className="pokemon__card--name">{e.name}</h3>
              <div>
                <div className="pokemon__card--stats">
                  <p>{bst}</p>
                </div>
              </div>
              <div className="pokemon__card--typesContainer">
                {types.map((e) => (
                  <span
                    style={{ background: colors[e] }}
                    className="pokemon__card--types"
                    key={e}
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
            <div className="pokemon__card--shadow">
              <img
                src={`/IconsPokemons/${types[0]}.svg`}
                alt="Silueta"
                className="pokemon__card--img2"
              />
            </div>
            <div>
              <img
                className="pokemon__card--img"
                src={e.sprites.other.dream_world.front_default}
                alt={e.name}
              />
            </div>
          </li>
        </Link>
      )
    })
  }
  const types = pokemonType.results?.map((e) => e.name) //Tipos de pokemones
  const options = ["4", "8", "12", "16", "20"] //Limites de pokemons
  const totalPages = Math.ceil(inicialPokemons?.length / Number(pokemonsLimit))

  const handleChange = (event, value) => {
    setCurrentPage(value)
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    const inputValue = inputValueRef.current
    if (inputValue) {
      const urlPokemon = `https://pokeapi.co/api/v2/pokemon/${inputValue}`

      axios
        .get(urlPokemon)
        .then(() => navigate(`/pokemon/${inputValue.toLowerCase()}`))
        .catch(() => {
          navigate("/notfound")
        })
    }
  }

  const handleChange2 = (event) => {
    inputValueRef.current = event.target.value
  }

  return (
    <main className="home">
      <LogOut />
      <h2 className="home__title">
        Bienvenid@ {userName || savedUser}, aqui puedes encontrar +1000{" "}
        <b>Pokemons</b> para ti!
      </h2>
      <div className="home__filters">
        <div className="inputGroup">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input type="text" onChange={handleChange2} />
            <button type="submit">Buscar</button>
            <label htmlFor="name">Busca tu pokemon aqui</label>
          </form>
        </div>
        <div className="home__filters--container">
          <div>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={options || []}
              disableClearable
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Pokemones por pagina" />
              )}
              onChange={(e, value) => setPokemonsLimit(value)}
            />
          </div>
          <div>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={types || []}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Tipos de pokemones" />
              )}
              onChange={(e, value) => setPokemonTypeSelected(value)}
            />
          </div>
        </div>
      </div>
      <div className="home__container">
        <PokemonList
          pokemonsLimit={pokemonsLimit}
          pokemonType={pokemonType}
          pokemonTypeSelected={pokemonTypeSelected}
        />
        <ul className="pokemon__list">{pokemonsToShow}</ul>
      </div>
      <div className="flex justify-center">
        {pokemonsToShow && (
          <div className="pagination">
            <Pagination
              onChange={handleChange}
              count={totalPages}
              defaultPage={1}
            />
          </div>
        )}
      </div>
    </main>
  )
}

export default Home
