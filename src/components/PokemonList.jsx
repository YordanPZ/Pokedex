import axios from "axios"
import { useState, useEffect } from "react"
import Pagination from "@mui/material/Pagination"
import PokemonCard from "./PokemonCard"
import Loader from "./Loader"

const PokemonList = ({ pokemonTypeSelected, pokemonType, pokemonsLimit }) => {
  const [pokemonList, setPokemonList] = useState([])
  const [showLoader, setShowLoader] = useState(false) //Loader
  const typeUrl = pokemonType?.results?.find(
    (type) => type.name === pokemonTypeSelected
  )?.url
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (pokemonTypeSelected !== "null" && typeUrl) {
      setShowLoader(true)

      axios
        .get(typeUrl)
        .then((res) => {
          getPokemonsIndividualData(res.data.pokemon)
        })
        .catch((err) => console.log(err))
        .finally(() => setShowLoader(false))
    }
  }, [pokemonTypeSelected, typeUrl])

  const getPokemonsIndividualData = (arrayPokemon) => {
    const fetchData = async () => {

      try {
        const fetchDataForPokemon = async (data) => {
          const res = await axios.get(data.pokemon.url)
          return res.data
        }
        const newPokemonsData = await Promise.all(
          arrayPokemon.map((item) => fetchDataForPokemon(item))
        )
        setPokemonList(newPokemonsData)
      } catch (err) {
        console.log(err)
      } finally {
        setShowLoader(false)
      }
    }
    fetchData()
    setShowLoader(false)
  }

  const lastIndex = currentPage * pokemonsLimit
  const firstIndex = lastIndex - pokemonsLimit

  const pokemonToShow = pokemonList
    ?.slice(firstIndex, lastIndex)
    .map((item) => {
      return <PokemonCard key={item.id} e={item} />
    })
  const totalPages = Math.ceil(pokemonList?.length / Number(pokemonsLimit))
  const handleChange = (e, value) => setCurrentPage(value)

  return (
    <>
      {showLoader ? (
        <Loader />
      ) : (
        pokemonTypeSelected && (
          <div>
            <span>Total:{pokemonList?.length}</span>
            <ul className="pokemon__list">{pokemonToShow}</ul>
            <div className="flex justify-center">
              <div className="pagination">
                <Pagination
                  onChange={handleChange}
                  count={totalPages}
                  defaultPage={1}
                />
              </div>
            </div>
          </div>
        )
      )}
    </>
  )
}

export default PokemonList
