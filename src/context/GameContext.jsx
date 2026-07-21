import { createContext, useContext, useState } from "react";

const GameContext = createContext();

export function GameProvider({ children }) {
  const [gameSettings, setGameSettings] = useState({
    playerCount: 3,
    expansions: ["base"], // Default to base expansion
    goals: {
        1: null,
        2: null,
        3: null,
        4: null,
    },
    players: [
        { //TODO: default players for testing, will be replaced with actual players when game is started
              id: 1,
              name: "Jack",
              
              cubeColor: "#d9534f",
              scores: {
                birdPoints: "",
                bonusCards: "",
                roundGoals: "",
                eggs: "",
                cachedFood: "",
                tuckedCards: "",
                nectarPoints: ""
          }}
    ],
    currentRound: 0, //0 means game hasn't started yet, 1-4 are the rounds of the game
    maxPlayers: 5, // Default to 5 players, when Asia is selected, update to 7
    
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
        // If the current player count is greater than 5 and the Asia expansion is being toggled, set playerCount to 5. Otherwise, keep the previous playerCount.
        playerCount: prev.playerCount > 5 && expansionId === "asia" ? 5 : prev.playerCount,
        expansions: prev.expansions.includes(expansionId)
        ? prev.expansions.filter(
            (expansion) => expansion !== expansionId
            )
        : [...prev.expansions, expansionId],
        //if Asia is selected, toggles maxplayers between 5 and 7, otherwise keeps the previous maxPlayers value
        maxPlayers: expansionId === "asia" ? (prev.maxPlayers === 5 ? 7 : 5) : prev.maxPlayers,
    }));
  };

  const updateRoundGoal = (roundNumber, goal) => {
    setGameSettings((prev) => ({
        ...prev,
        goals: {
            ...prev.goals,
            [roundNumber]: goal,
        },
    }));
};

  const resetGameSettings = () => {
    setGameSettings({
      playerCount: 3,
      expansions: ["base"],
      goals: {
        1: null,
        2: null,
        3: null,
        4: null,
      },
    });
  };

  const addPlayer = (player) => {
  setGameSettings((prev) => ({
    ...prev,
    players: [
      ...prev.players,
      player,
    ],
  }));
};

    const advanceRound = () => {
        setGameSettings((prev) => ({
            ...prev,
            currentRound:
            prev.currentRound < 4
                ? prev.currentRound + 1
                : 4,
        }));
    };

    const updateRound = (roundNumber) => {
        setGameSettings((prev) => ({
            ...prev,
            currentRound: roundNumber,
        }));
    }

    const updatePlayerScores = (
    playerId,
    scores
    ) => {
    setGameSettings((prev) => ({
        ...prev,

        players: prev.players.map((player) =>
        player.id === playerId
            ? {
                ...player,
                scores,
            }
            : player
        ),
    }));
    };

  return (
    <GameContext.Provider
      value={{
        gameSettings,

        updatePlayerCount,
        toggleExpansion,

        updateRoundGoal,

        resetGameSettings,

        addPlayer,
        advanceRound,
        updateRound,
        updatePlayerScores,
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