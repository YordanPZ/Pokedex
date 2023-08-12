import { Link } from "react-router-dom"
import colors from "../Colors"

function PokemonCard({ e }) {
  const types = e?.types?.map((e) => e.type.name)
  const bst = e?.stats?.reduce((acc, stat) => {
    return acc + stat.base_stat
  }, 0)
  const color = colors[types?.[0]]
  const official = e.sprites.other["official-artwork"].front_default //BackUp para las imagenes
  return (
    <Link to={`/pokemon/${e?.name}`} key={e?.id}>
      <li style={{ background: color }} className="pokemon__card relative" key={e?.id}>
        <div className="pokemon__card--container">
          <h3 className="pokemon__card--name">{e?.name}</h3>
          <div>
            <div className="pokemon__card--stats">
              <p>{bst}</p>
            </div>
          </div>
          <div className="pokemon__card--typesContainer">
            {types?.map((e) => (
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
            src={`/IconsPokemons/${types?.[0]}.svg`}
            alt="Silueta"
            className="pokemon__card--img2"
          />
        </div>
        <div>
          <img
            className="pokemon__card--img"
            src={e?.sprites.other.dream_world.front_default || official}
            alt={e?.name}
          />
        </div>
      </li>
    </Link>
  )
}

export default PokemonCard
