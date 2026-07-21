import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LobbyPage from '../pages/LobbyPage';
import RoundPage from '../pages/RoundPage';
import FinalScoringPage from '../pages/FinalScoringPage';
import ResultsPage from '../pages/ResultsPage';
import GameSettingPage from '../pages/GameSettingPage';
import AvailableGamesPage from '../pages/AvailableGamesPage';

function AppRouter() {
  return (
    <BrowserRouter future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
    }}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game-settings" element={<GameSettingPage />} />
        <Route path="/available-games" element={<AvailableGamesPage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/round" element={<RoundPage />} />
        <Route path="/scoring" element={<FinalScoringPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
