import axios from "axios"
import { useState, useEffect } from "react"
import colors from "../Colors"
import { Link } from "react-router-dom"
import Pagination from "@mui/material/Pagination"

//!HAY UN PEQUEÑO ERROR AL SELECCIONAR EL TIPO SHADOW Y UNKNOWN NO SE ACTUALIZA EL ESTADO Y MUESTRA LOS ANTERIORES
const PokemonList = ({ pokemonTypeSelected, pokemonType, pokemonsLimit }) => {
  const [inicialInfo, setInicialInfo] = useState([])
  const [pokemonList, setPokemonList] = useState([])
  const typeUrl = pokemonType?.results?.find(
    (type) => type.name === pokemonTypeSelected
  )?.url
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (pokemonTypeSelected !== "null" && typeUrl) {
      setPokemonList([])

      axios
        .get(typeUrl)
        .then((res) => setInicialInfo(() => res.data.pokemon))
        .catch((err) => console.log(err))
    }
  }, [pokemonTypeSelected, typeUrl])

  useEffect(() => {
    //Async await para que no se dupliquen
    setPokemonList([])
    const fetchData = async () => {
      try {
        const fetchDataForPokemon = async (e) => {
          const res = await axios.get(e.pokemon.url)
          return res.data
        }
        const newPokemonsData = await Promise.all(
          inicialInfo.map(fetchDataForPokemon)
        )
        setPokemonList(newPokemonsData)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [inicialInfo, pokemonTypeSelected])

  const lastIndex = currentPage * pokemonsLimit
  const firstIndex = lastIndex - pokemonsLimit

  //!AQUI SE MUESTRAN LOS POKEMONS limitados
  const pokemonToShow = pokemonList
    ?.slice(firstIndex, lastIndex)
    .map((item) => {
      const types = item.types.map((e) => e.type.name)
      const bst = item.stats.reduce((acc, stat) => {
        return acc + stat.base_stat
      }, 0)
      const color = colors[types[0]]
      const base = item.sprites.front_default //BackUp para las imagenes
      const official = item.sprites.other["official-artwork"].front_default //BackUp para las imagenes
      return (
        <Link to={`/pokemon/${item.name}`} key={item.id}>
          <li
            style={{ background: color }}
            className="pokemon__card"
            key={item.id}
          >
            <div className="pokemon__card--container">
              <h3 className="pokemon__card--name">{item.name}</h3>
              <div>
                <div className="pokemon__card--stats">
                  <p>{bst}</p>
                </div>
              </div>
              <div>
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
                src={
                  item.sprites.other.dream_world.front_default ||
                  official ||
                  base
                }
                alt={item.name}
              />
            </div>
          </li>
        </Link>
      )
    })
  const totalPages = Math.ceil(pokemonList?.length / Number(pokemonsLimit))
  const handreChange = (e, value) => setCurrentPage(value)

  return (
    <>
      {pokemonTypeSelected && (
        <div>
          <span>Total:{pokemonList?.length}</span>
          <ul className="pokemon__list">{pokemonToShow}</ul>
          <div className="flex justify-center">
            <div className="pagination">
              <Pagination
                onChange={handreChange}
                count={totalPages}
                defaultPage={1}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PokemonList
