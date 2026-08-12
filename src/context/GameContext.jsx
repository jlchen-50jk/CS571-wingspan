import { createContext, useContext, useState } from "react";
import { SCORE_CATEGORIES } from "../data/scoreCategories";
import GOALS from "../data/goals";
import { loadGame, loadPlayers, loadScores, loadRoundGoals } from "../services/gameService";

const GameContext = createContext();

export function GameProvider({ children }) {

  const NEWGAMESTATE = {
    id: null, // Unique identifier for the game session
    lobbyCode: "",
    playerCount: 3,
    expansions: ["base"], // Default to base expansion
    status: "", // "lobby", "round" + currentRound, "final scoring", "results"
    goals: {
        1: null,
        2: null,
        3: null,
        4: null,
    },
    players: [],
    currentRound: 0, //0 means game hasn't started yet, 1-4 are the rounds of the game
    maxPlayers: 5, // Default to 5 players, when Asia is selected, update to 7
  }

  const [gameSettings, setGameSettings] = useState(NEWGAMESTATE);

 

  function assignGameId() {
    const gameId = Math.random().toString(36).substring(2, 6);
    setGameSettings((prev) => ({
      ...prev,
      id: gameId,
    }));
  }

  const setPlayers = (
  players
) => {
  setGameSettings(
    (prev) => ({
      ...prev,
      players,
    })
  );
};

  function assignPlayerId() {
    const playerId = gameSettings.players?.length + 1; // Assigns a player ID based on the current number of players
    //TODO: need to return error if lobby is full
    setGameSettings((prev) => ({
      ...prev,
      players: [
        ...prev.players,
        {
          id: playerId,
          scores: {
            ...SCORE_CATEGORIES.reduce((acc, category) => {
              acc[category.key] = "";
              return acc;
            }, {})
          },
        }
      ],
    }));
    return playerId;
  }

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
        maxPlayers: expansionId === "asia" && prev.expansions.includes(expansionId) ? 5 : (expansionId === "asia" ? 7 : prev.maxPlayers),
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
    setGameSettings(NEWGAMESTATE);
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

  function updatePlayerInfo(playerId, playerInfo) {
    setGameSettings((prev) => ({
      ...prev,
      players: prev.players.map((player) =>
        player.id === playerId
          ? {
              ...player,
              ...playerInfo,
            }
          : player
      ),
    }));
  }

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

  const updatePlayerScores = (playerId, scores) => {
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

  const loadGameSettings =
  (game) => {
    setGameSettings(
      (prev) => ({
        ...prev,

        id: game.id,

        lobbyCode:
          game.lobby_code,

        playerCount:
          game.player_count,

        maxPlayers:
          game.max_players,

        status:
          game.status,

        currentRound:
          game.current_round,

        expansions:
          game.expansions,
      })
    );
  };

  const hydrateGame =
  async (gameId) => {

    const {
      data: game,
      error: gameError,
    } = await loadGame(gameId);

    if (gameError) {
      throw gameError;
    }

    const {
      data: players,
      error: playerError,
    } = await loadPlayers(gameId);

    if (playerError) {
      throw playerError;
    }

    const {
      data: scores,
      error: scoreError,
    } = await loadScores(gameId);

    if (scoreError) {
      throw scoreError;
    }

    const {
      data: roundGoals,
      error: roundGoalError,
    } = await loadRoundGoals(
      gameId
    );

    if (roundGoalError) {
      throw roundGoalError;
    }

    const goalMap = {};

    roundGoals.forEach((goal) => {

      goalMap[
        goal.round_number
      ] = goal.goal_id;

    });

    roundGoals.forEach((goal) => {

      goalMap[
        goal.round_number
      ] =
        GOALS.find(
          (g) =>
            g.id === goal.goal_id
        ) ?? null;

    });

    const scoreMap = {};

    scores.forEach((score) => {

      scoreMap[
        score.players.seat_number
      ] = {

        birdPoints:
          score.bird_points,

        bonusCards:
          score.bonus_cards,

        roundGoals:
          score.round_goals,

        eggs:
          score.eggs,

        cachedFood:
          score.cached_food,

        tuckedCards:
          score.tucked_cards,

        nectar: {
          forest:
            score.nectar_forest,

          grassland:
            score.nectar_grassland,

          wetland:
            score.nectar_wetland,
        },

      };

    });

    setGameSettings({

      id: game.id,

      lobbyCode:
        game.lobby_code,

      playerCount:
        game.player_count,

      maxPlayers:
        game.max_players,

      status:
        game.status,

      currentRound:
        game.current_round,

      expansions:
        game.expansions,

      goals: {
        1: goalMap[1] ?? null,
        2: goalMap[2] ?? null,
        3: goalMap[3] ?? null,
        4: goalMap[4] ?? null,
      },

      players: players.map(
        (player) => ({

          id:
            player.seat_number,

          dbId:
            player.id,

          name:
            player.name,

          cubeColor:
            player.cube_color,

          isHost:
            player.is_host,

          scores:
            scoreMap[
              player.seat_number
            ] ?? {},

        })
      ),

    });

  };

  return (
    <GameContext.Provider
      value={{
        gameSettings,

        assignGameId,
        assignPlayerId,
        updatePlayerCount,
        toggleExpansion,

        updateRoundGoal,

        resetGameSettings,

        setPlayers,
        addPlayer,
        updatePlayerInfo,
        advanceRound,
        updateRound,
        updatePlayerScores,
        loadGameSettings,
        hydrateGame,
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