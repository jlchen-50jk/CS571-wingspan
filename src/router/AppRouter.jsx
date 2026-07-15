import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LobbyPage from '../pages/LobbyPage';
import RoundPage from '../pages/RoundPage';
import GoalEntryPage from '../pages/GoalEntryPage';
import RoundSummaryPage from '../pages/RoundSummaryPage';
import FinalScoringPage from '../pages/FinalScoringPage';
import ResultsPage from '../pages/ResultsPage';
import GameSettingPage from '../pages/GameSettingPage';

function AppRouter() {
  return (
    <BrowserRouter future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
    }}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game-settings" element={<GameSettingPage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/round/:roundNumber" element={<RoundPage />} />
        <Route path="/goal-entry/:roundNumber" element={<GoalEntryPage />} />
        <Route path="/summary/:roundNumber" element={<RoundSummaryPage />} />
        <Route path="/scoring" element={<FinalScoringPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
