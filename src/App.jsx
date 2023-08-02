import "./App.css"
import { HashRouter, Routes, Route } from "react-router-dom"
import Intro from "./pages/Intro"
import Home from "./pages/Home"
import Nav from "./components/Nav"
import PokemonDetail from "./pages/PokemonDetail"
import ErrorPage from "./pages/ErrorPage"

function App() {
  return (
    <>
      <HashRouter>
        <Nav />
        <Routes>
          <Route path="/pokemon/:name" element={<PokemonDetail />} />
          <Route path="/" element={<Intro />} />
          <Route path="/home" element={<Home />} />
          <Route path="/notfound" element={<ErrorPage />} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
