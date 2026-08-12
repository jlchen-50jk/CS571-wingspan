import { supabase } from "../lib/supabase";

// ======================================================
// Games
// ======================================================

export const createGame = async (
  gameSettings,
  lobbyCode
) => {
  return await supabase
    .from("games")
    .insert({
      lobby_code: lobbyCode,

      status: gameSettings.status,

      player_count: gameSettings.playerCount,

      max_players: gameSettings.maxPlayers,

      current_round: gameSettings.currentRound,

      expansions: gameSettings.expansions,
    })
    .select()
    .single();
};

export const createGameWithHost =
  async (gameSettings, hostPlayer) => {

    const lobbyCode =
      Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase();
    
    const gameToCreate = {
      ...gameSettings,
      status: "lobby",
    };

    const {
      data: game,
      error: gameError,
    } = await createGame(
      gameToCreate,
      lobbyCode
    );

    if (gameError) {
      return {
        data: null,
        error: gameError,
      };
    }

    const {
      data: player,
      error: playerError,
    } = await addPlayer(
      game.id,
      {
        name: "",
        cubeColor: "",
        seatNumber: 1,
        isHost: true,
      }
    );

    if (playerError) {
      return {
        data: null,
        error: playerError,
      };
    }

    return {
      data: {
        game,
        player,
      },
      error: null,
    };
  };

export const loadGame = async (
  gameId
) => {
  return await supabase
    .from("games")
    .select("*")
    .eq("id", gameId)
    .single();
};

export const loadGameByLobbyCode =
  async (lobbyCode) => {
    return await supabase
      .from("games")
      .select("*")
      .eq("lobby_code", lobbyCode)
      .single();
  };

export const updateGame = async (
  gameId,
  updates
) => {
  return await supabase
    .from("games")
    .update(updates)
    .eq("id", gameId)
    .select()
    .single();
};

export const updateGameStatus =
  async (gameId, status) => {
    return updateGame(gameId, {
      status,
    });
  };

export const advanceRound = async (
  gameId,
  currentRound
) => {
  return updateGame(gameId, {
    current_round: currentRound + 1,
  });
};

export const deleteGame = async (
  gameId
) => {
  return await supabase
    .from("games")
    .delete()
    .eq("id", gameId);
};

export const startGame = async (
  gameId
) => {
  return updateGame(gameId, {
    status: "round",
    current_round: 1,
  });
};

export const goToScoring = async (
  gameId
) => {
  return updateGame(gameId, {
    status: "scoring",
  });
};

export const goToResults = async (
  gameId
) => {
  return updateGame(gameId, {
    status: "results",
  });
};

export const nextRound = async (
  gameId,
  currentRound
) => {
  return updateGame(gameId, {
    current_round:
      currentRound + 1,
  });
};

// ======================================================
// Players
// ======================================================

export const addPlayer = async (
  gameId,
  player
) => {
  return await supabase
    .from("players")
    .insert({
      game_id: gameId,

      name: player.name,

      cube_color: player.cubeColor,

      seat_number: player.seatNumber,

      is_host:
        player.isHost ?? false,
    })
    .select()
    .single();
};

export const loadPlayers =
  async (gameId) => {
    return await supabase
      .from("players")
      .select("*")
      .eq("game_id", gameId)
      .order("seat_number");
  };

export const updatePlayer =
  async (playerId, updates) => {
    return await supabase
      .from("players")
      .update(updates)
      .eq("id", playerId)
      .select()
      .single();
  };

export const removePlayer =
  async (playerId) => {
    return await supabase
      .from("players")
      .delete()
      .eq("id", playerId);
  };

export const getAvailableGames =
  async () => {
    const { data: games, error } =
      await supabase
        .from("games")
        .select("*")
        .eq("status", "lobby")
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      return {
        data: null,
        error,
      };
    }

    const gamesWithPlayers =
      await Promise.all(
        games.map(async (game) => {
          const {
            data: players,
          } =
            await loadPlayers(
              game.id
            );

          return {
            ...game,
            current_players:
              players?.length ?? 0,
          };
        })
      );

    return {
      data: gamesWithPlayers,
      error: null,
    };
  };

  export const joinGame = async (
  gameId
) => {
  const { data: players, error } =
    await loadPlayers(gameId);

  if (error) {
    return { data: null, error };
  }

  const seatNumber =
    (players?.length ?? 0) + 1;

  return await addPlayer(
    gameId,
    {
      name: "",
      cubeColor: "",
      seatNumber,
      isHost: seatNumber === 1,
    }
  );
};

// ======================================================
// Round Goals
// ======================================================

export const saveRoundGoal =
  async (
    gameId,
    roundNumber,
    goalId
  ) => {
    return await supabase
      .from("round_goals")
      .upsert({
        game_id: gameId,

        round_number:
          roundNumber,

        goal_id: goalId,
      });
  };

export const loadRoundGoals =
  async (gameId) => {
    return await supabase
      .from("round_goals")
      .select("*")
      .eq("game_id", gameId);
  };

export const saveRoundGoalResult =
  async (
    gameId,
    playerId,
    roundNumber,
    goalCount
  ) => {

    return await supabase
      .from(
        "round_goal_results"
      )
      .upsert({
        game_id: gameId,

        player_id: playerId,

        round_number:
          roundNumber,

        goal_count:
          goalCount,

        submitted: true,

        resolved: false,
      })
      .select()
      .single();

  };

export const loadRoundGoalResults =
  async (
    gameId,
    roundNumber
  ) => {

    return await supabase
      .from(
        "round_goal_results"
      )
      .select(`
        *,
        players!inner(
          id,
          seat_number,
          name
        )
      `)
      .eq(
        "game_id",
        gameId
      )
      .eq(
        "round_number",
        roundNumber
      );

  };

export const updateRoundGoalResult =
  async (
    id,
    updates
  ) => {

    return await supabase
      .from(
        "round_goal_results"
      )
      .update(updates)
      .eq("id", id);

  };

export const subscribeToRoundGoalResults =
  (
    callback
  ) => {

    return supabase
      .channel(
        "round-goal-results"
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table:
            "round_goal_results",
        },
        callback
      )
      .subscribe();

  };

  

// ======================================================
// Scores
// ======================================================


export const saveScores = async (
  playerId,
  scores
) => {

  console.log(
    "saveScores received",
    playerId,
    scores
  );

  const result =
    await supabase
      .from("scores")
      .upsert({
        player_id: playerId,

        bird_points:
          scores.birdPoints,

        bonus_cards:
          scores.bonusCards,

        round_goals:
          scores.roundGoals,

        eggs:
          scores.eggs,

        cached_food:
          scores.cachedFood,

        tucked_cards:
          scores.tuckedCards,

        nectar_forest:
          Number(
            scores.nectar?.forest
          ) || 0,

        nectar_grassland:
          Number(
            scores.nectar?.grassland
          ) || 0,

        nectar_wetland:
          Number(
            scores.nectar?.wetland
          ) || 0,

        submitted: true,
      })
      .select();

  console.log(
    "saveScores supabase result",
    result
  );

  return result;
};

export const loadScores =
  async (gameId) => {
    return await supabase
      .from("scores")
      .select(`
        *,
        players!inner(
          id,
          game_id,
          name,
          cube_color,
          seat_number,
          is_host
        )
      `)
      .eq(
        "players.game_id",
        gameId
      );
  };

// ======================================================
// Realtime
// ======================================================

export const subscribeToPlayers =
  (
    gameId,
    callback
  ) => {
    return supabase
      .channel(
        `players-${gameId}`
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `game_id=eq.${gameId}`,
        },
        callback
      )
      .subscribe();
  };

export const subscribeToGames =
  (
    gameId,
    callback
  ) => {
    return supabase
      .channel(
        `game-${gameId}`
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "games",
          filter: `id=eq.${gameId}`,
        },
        callback
      )
      .subscribe();
  };

export const subscribeToScores =
  (
    callback
  ) => {
    return supabase
      .channel("scores")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "scores",
        },
        callback
      )
      .subscribe();
  };

export const unsubscribe = (
  channel
) => {
  supabase.removeChannel(
    channel
  );
};