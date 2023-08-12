import { useSelector } from "react-redux"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import PokemonList from "../components/PokemonList"
import { fetchData } from "../FetchData"
import LogOut from "../components/LogOut"
import Pagination from "@mui/material/Pagination"
import { useNavigate } from "react-router-dom"
import PokemonCard from "../components/PokemonCard"
import Loader from "../components/Loader"

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
  const [showLoader, setShowLoader] = useState(false) //Loader
  //*Username
  const userName = useSelector((state) => state.userName) //Username a saludar
  const savedUser = JSON.parse(localStorage.getItem("user")).userName //Hacer la peticion al local storage para saludar con ese nombre

  useEffect(() => {
    //Axios que trae los datos de los pokemones (sin imagenes)
    setShowLoader(true)
    axios
      .get(urlInicialPokemons)
      .then((res) => {
        setInicialInfo(res.data)
      })
      .catch((err) => console.log(err))
      .finally(() => setShowLoader(false))

    //Axios que trae los tipos de los pokemones
    axios
      .get(typesPokemon)
      .then((res) => setPokemonType(res.data))
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    //Async & Await que trae los datos de los pokemones (con imagenes) (Async & Await para que no se dupliquen)
    setInicialPokemons([])
    fetchData(inicialInfo, setInicialPokemons, setShowLoader)
  }, [inicialInfo])

  const lastIndex = currentPage * pokemonsLimit
  const firstIndex = lastIndex - pokemonsLimit

  //Si el usuario no selecciona ningun tipo de pokemon, se muestran todos los pokemons (los 20 iniciales)
  let pokemonsToShow
  if (pokemonTypeSelected === null) {
    pokemonsToShow = inicialPokemons.slice(firstIndex, lastIndex).map((e) => {
      return <PokemonCard key={e.id} e={e} />
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
      setShowLoader(true)
      const urlPokemon = `https://pokeapi.co/api/v2/pokemon/${inputValue}`

      axios
        .get(urlPokemon)
        .then(() => navigate(`/pokemon/${inputValue.toLowerCase()}`))
        .catch(() => {
          navigate("/notfound")
        })
        .finally(() => setShowLoader(false))
    }
  }

  const handleChange2 = (event) => {
    inputValueRef.current = event.target.value
  }

  return (
    <main className="home">
      <LogOut />
      <h1 className="home__title">
        Bienvenid@ <strong>{userName || savedUser}</strong>, aqui puedes
        encontrar +1000 <b>Pokemons</b> para ti!
      </h1>
      {showLoader ? (
        <Loader />
      ) : (
        <>
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
              lastIndex={lastIndex}
              firstIndex={firstIndex}
            />

            <ul className="pokemon__list">{pokemonsToShow}</ul>
          </div>
          <div className="flex justify-center w-full">
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
        </>
      )}
    </main>
  )
}

export default Home
