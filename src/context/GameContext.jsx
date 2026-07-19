import { createContext, useContext, useState } from "react";

const GameContext = createContext();

export function GameProvider({ children }) {
  const [gameSettings, setGameSettings] = useState({
    playerCount: 3,
    expansions: [],
    goals: [],
  });

  const updatePlayerCount = (count) => {
    setGameSettings((prev) => ({
      ...prev,
      playerCount: count,
    }));
  };

  const toggleExpansion = (expansionId) => {
    setGameSettings((prev) => ({
      ...prev,
      expansions: prev.expansions.includes(expansionId)
        ? prev.expansions.filter(
            (expansion) => expansion !== expansionId
          )
        : [...prev.expansions, expansionId],
    }));
  };

  const addGoal = (goal) => {
    setGameSettings((prev) => ({
      ...prev,
      goals: [...prev.goals, goal],
    }));
  };

  const removeGoal = (goalId) => {
    setGameSettings((prev) => ({
      ...prev,
      goals: prev.goals.filter(
        (goal) => goal.id !== goalId
      ),
    }));
  };

  const setGoals = (goals) => {
    setGameSettings((prev) => ({
      ...prev,
      goals,
    }));
  };

  const resetGameSettings = () => {
    setGameSettings({
      playerCount: 3,
      expansions: [],
      goals: [],
    });
  };

  return (
    <GameContext.Provider
      value={{
        gameSettings,

        updatePlayerCount,
        toggleExpansion,

        addGoal,
        removeGoal,
        setGoals,

        resetGameSettings,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error(
      "useGame must be used within a GameProvider"
    );
  }

  return context;
}