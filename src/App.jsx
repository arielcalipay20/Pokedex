import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PokemonList from './pages/PokemonList';
import PokemonDetails from './pages/PokemonDetails';
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PokemonList />} />
        <Route path="/pokemon/:id" element={<PokemonDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
