import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"
import { useEffect, useState, useMemo } from "react"
import "./PokemonDetail.css"
import axios from "axios"
import colors from "../Colors"
import { Card, Metric, Text, Flex, ProgressBar, Grid } from "@tremor/react"
import { useNavigate } from "react-router-dom"
import Loader from "../components/Loader"
import { rutas, logos } from "../Colors"

function PokemonDetail() {
  const { name } = useParams()
  const navigate = useNavigate()
  const [showLoader, setShowLoader] = useState(false) //Loader
  const [pokemonInfo, setPokemonInfo] = useState([])
  useEffect(() => {
    //Recupera toda la info del pokemon seleccionado
    setShowLoader(true)

    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((res) => setPokemonInfo(res.data))
      .catch(() => {
        navigate("/notfound")
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])

  const [evolutionUrl, setEvolutionUrl] = useState([])
  const [evolutions, setEvolutions] = useState([])

  const urlEvolucion = pokemonInfo.species?.url

  useEffect(() => {
    //Recupero la url de donde sacar las evoluciones del pokemon
    setShowLoader(true)
    if (pokemonInfo.id) {
      axios
        .get(urlEvolucion)
        .then((respuesta1) => {
          const url1 = respuesta1.data.evolution_chain.url
          axios
            .get(url1)
            .then((rep) => setEvolutionUrl(rep.data))
            .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
    }
  }, [pokemonInfo.id, urlEvolucion])

  //UseMemo porque solo se ejecuta cuando cambia el valor de la variable guia, sino se hace un bucle ya que se crea en cada renderizado
  //Guardo los nombres de las evoluciones

  const evolutionsInfo = useMemo(() => {
    if (!evolutionUrl.chain) return [] // Si no hay cadena de evolución, retorna un array vacío

    const firstEvolution = evolutionUrl.chain.species?.name || ""
    const secondEvolution =
      evolutionUrl.chain.evolves_to[0]?.species?.name || ""

    // Verificar si hay una tercera evolución antes de acceder a ella
    const thirdEvolution =
      evolutionUrl.chain.evolves_to[0]?.evolves_to[0]?.species?.name || ""

    return [
      { evolution: firstEvolution },
      { evolution: secondEvolution },
      { evolution: thirdEvolution }
    ]
  }, [evolutionUrl])
  //Hago una peticion por cada nombre para traerme las fotos y guardarlo en un estado
  useEffect(() => {
    const fetchEvolutions = async () => {
      try {
        //creo un array de peticiones para cada nombre de evolucion
        const requests = evolutionsInfo.map((e) => {
          const url = `https://pokeapi.co/api/v2/pokemon/${e.evolution}`
          return axios.get(url)
        })

        //Creo un array con las respuestas de las peticiones
        const responses = await Promise.all(requests)
        //filtro la info y me quedo con el res.data
        const info = responses.map((res) => res.data)

        setEvolutions(info) //asigno la info de las evoluciones
      } catch (error) {
        console.error(error)
      } finally {
        setShowLoader(false)
      }
    }

    fetchEvolutions()
  }, [evolutionsInfo])

  const principalType = pokemonInfo.types?.[0].type.name
  const backgroundColor = colors[principalType]

  const typesText = pokemonInfo.types?.length === 1 ? "Tipo" : "Tipos"
  const types = pokemonInfo.types?.map((type, index) => {
    const color = colors[type.type.name]
    return (
      <p
        style={{ background: color }}
        className="pokemon__card--types"
        key={index}
      >
        {type.type.name}
      </p>
    )
  })
  console.log(pokemonInfo.types?.[0].type.name)
  const bgImage = rutas.find((ruta) =>
    ruta.includes(pokemonInfo.types?.[0].type.name)
  )

  const stats = [
    {
      metric: pokemonInfo.stats?.[0].base_stat,
      title: "Vida",
      max: 250,
      value: ((pokemonInfo.stats?.[0].base_stat / 250) * 100).toFixed(1),
      unity: "hp"
    },
    {
      metric: `${pokemonInfo.stats?.[1].base_stat}`,
      title: "Ataque",
      max: 134,
      value: ((pokemonInfo.stats?.[1].base_stat / 134) * 100).toFixed(1),
      unity: "Pts"
    },
    {
      metric: `${pokemonInfo.stats?.[2].base_stat}`,
      title: "Defensa",
      max: 200,
      value: ((pokemonInfo.stats?.[2].base_stat / 200) * 100).toFixed(1),
      unity: "Pts"
    },
    {
      metric: `${pokemonInfo.stats?.[5].base_stat}`,
      title: "Velocidad",
      max: 120,
      value: ((pokemonInfo.stats?.[5].base_stat / 200) * 120).toFixed(1),
      unity: "Pts"
    }
  ]
  const official = pokemonInfo?.sprites?.other["official-artwork"].front_default //BackUp para las imagenes
  const evolution = evolutions.map((pokemon, index) => {
    return (
      <div key={index}>
        <h4>{pokemon.name}</h4>
        <img
          className="evolution__img"
          src={pokemon.sprites?.front_default}
          alt={pokemon.name}
        />
      </div>
    )
  })
  const colorTipo = logos[0][pokemonInfo.types?.[0].type.name]
  console.log(colorTipo)

  return (
    <main className="main">
      {showLoader ? <Loader /> : false}
      <Link className="redirect" clas to={"/home"}>
        <img src="/home.png" alt="" />
      </Link>
      <h1 className="title flex items-center justify-between flex-wrap">
        {pokemonInfo.name}{" "}
        <button
          onClick={() => navigate(-1)}
          className="text-base cursor-pointer :^hover:text-blue-500 hover:underline transition-all duration-300 ease-in-out"
        >
          Volver
        </button>
      </h1>
      <hr className="border-black" />
      <div className="main__container">
        <div
          style={{
            position: "relative"
          }}
          className="main__container__img"
        >
          <img
            className="main__container__img__bg"
            src={bgImage}
            alt={pokemonInfo.name}
            style={{
              filter: `drop-shadow(0px 0px 30px ${colorTipo})`,
              height: 1000
            }}
          />
          <img
            src={
              pokemonInfo.sprites?.other.dream_world.front_default || official
            }
            alt={pokemonInfo.name}
          />
        </div>
        <div className="main__container__info">
          <div className="main__container__types ">
            <h4>{typesText}</h4>
            <div className="main__container__types__img">{types}</div>
          </div>
          <div className="main__container__stats">
            <div className="main__container__stats__color">
              <img src="/scale.svg" alt="" />
              {pokemonInfo.weight / 10} kg
            </div>
            <div className="main__container__stats__color">
              <i className="bx bx-ruler text-4xl"></i>
              {pokemonInfo.height / 10} m
            </div>
          </div>
          <div>
            <h4>Habilidades Iniciales</h4>
            <div className="main__container__abilities">
              {pokemonInfo.abilities?.map((type, index) => (
                <p
                  style={{ background: backgroundColor }}
                  className="main__container__abilities--inner"
                  key={index}
                >
                  {type.ability.name}
                </p>
              ))}
            </div>
          </div>
          <div className="main__container--stats">
            <h4>Inicial Stats</h4>
            <Grid className="gap-6 flex flex-wrap items-center justify-center m-2">
              {stats.map((stats, index) => {
                return (
                  <Card key={index} className="p-2 w-40 drop">
                    <Text>
                      {stats.title}
                      {stats.unity ? ` (${stats.unity})` : ""}
                    </Text>
                    <Metric>{stats.metric}</Metric>
                    <Flex className="mt-4">
                      <Text>{stats.value}%</Text>
                      <Text>{stats.max}(max)</Text>
                    </Flex>
                    <ProgressBar value={stats.value} className="mt-2" />
                  </Card>
                )
              })}
            </Grid>
          </div>
          <div>
            <h4>Evoluciones</h4>
            <div className="main__container__evolutions">
              {/* Verifica si el array de evoluciones está vacío */}
              {evolution.length > 0 ? evolution : <p>Sin Evoluciones</p>}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default PokemonDetail
