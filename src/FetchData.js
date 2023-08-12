import axios from "axios"
//Funcion asyncrona separada del codigo porque queria reutilizarla
export const fetchData = async (Urls,fetch,setShowLoader) => {
    try {
      setShowLoader(true)
      if (!Urls.results) {
        return;
      }
      const fetchDataForPokemon = async (e) => {
        const res = await axios.get(e.url)
        return res.data
      }
      const newPokemonsData = await Promise.all(
        Urls.results?.map(fetchDataForPokemon)
      )
      fetch(newPokemonsData)
    } catch (err) {
      console.log(err)
    } finally {
      setShowLoader(false)
    }
  }
  
