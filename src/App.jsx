import AppRouter from './router/AppRouter';
import './styles/theme.css';
import './styles/app.css';
import { GameProvider } from './context/GameContext';

function App() {
  return (
    <GameProvider>
      <AppRouter />
    </GameProvider>
  );
}

export default App;
