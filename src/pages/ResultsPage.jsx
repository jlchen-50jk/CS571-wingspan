import { Container, Button, Stack, Image, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { SCORE_CARD_CONFIGS } from "../data/scoreCardConfig";
import { useEffect } from "react";

function ResultsPage() {
  const navigate = useNavigate();
  
  const { gameSettings, resetGameSettings, hydrateGame } = useGame();
  useEffect(() => {
    if (gameSettings.players.length > 0) {
      return;
    }

    const gameId = sessionStorage.getItem("gameId");

    if (!gameId) {
      return;
    }

    hydrateGame(gameId);

  }, []);

  const renderField = (field, player, rank) => {
    switch (field) {
      case "playerName":
        return (
          <>{player.name} {getRankDisplay(rank)}</>
        );

      case "nectarPlayed":
        return (
          <div className="nectar-played-row">
            <span>
              {player.scores?.nectar?.forest ?? 0}
            </span>

            <span>
              {player.scores?.nectar?.grassland ?? 0}
            </span>

            <span>
              {player.scores?.nectar?.wetland ?? 0}
            </span>
          </div>
        );

      case "nectar":
        return nectarScores[player.id] ?? 0;

      case "total":
        return player.total;

      default:
        return calculateScore(player.scores?.[field]);
    }
  };

  const calculateNectarScores = (players) => {
    const habitats = ["forest", "grassland", "wetland"];
    const nectarScores = {};

    players.forEach((player) => {nectarScores[player.id] = 0;});

    habitats.forEach((habitat) => {
      const values = players
        .map((player) => ({
          id: player.id,
          value: Number(player.scores?.nectar?.[habitat]) || 0,
        }))
        .sort((a, b) => b.value - a.value);

      const firstValue = values[0]?.value ?? 0;

      if (firstValue === 0) {
        return;
      }

      const firstPlace = values.filter((v) => v.value === firstValue);
      const secondValue = values.find((v) => v.value < firstValue)?.value;
      const secondPlace = secondValue !== undefined 
        ? values.filter((v) => v.value === secondValue): [];

      if (firstPlace.length > 1) {
        const splitPoints = Math.floor((5 + 2) / firstPlace.length);
        firstPlace.forEach((player) => {nectarScores[player.id] += splitPoints});
      } else {
        nectarScores[firstPlace[0].id] += 5;

        if (secondPlace.length > 0 && secondValue > 0) {
          const splitPoints = Math.floor(2 / secondPlace.length);

          secondPlace.forEach((player) => {nectarScores[player.id] += splitPoints;});
        }
      }
    });

    return nectarScores;
  };

  const calculateScore = (value) => {
    if (!value) return 0;

    if (!/^[0-9+\-*/() ]+$/.test(value)) {
      return 0;
    }

    try {
      return Number(
        Function(
          `"use strict"; return (${value})`
        )()
      );
    } catch {
      return 0;
    }
  };

  const calculatePlayerTotal = (player) => {
    const scores = player.scores ?? {};

    return (
      calculateScore(scores.birdPoints) +
      calculateScore(scores.bonusCards) +
      calculateScore(scores.roundGoals) +
      calculateScore(scores.eggs) +
      calculateScore(scores.cachedFood) +
      calculateScore(scores.tuckedCards)
    );
  };

  const players = gameSettings.players.map((player) => ({...player,}));

  const nectarScores = calculateNectarScores(players);

  players.forEach((player) => {player.total = calculatePlayerTotal(player) + (nectarScores[player.id] ?? 0)});

  const rankings = [...players]
    .sort((a, b) => b.total - a.total)
    .reduce((acc, player, index) => {
      acc[player.id] = index + 1;
      return acc;
    }, {});

  const getRankDisplay = (rank) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  const getScoreCard = () => {
    const { expansions, playerCount } =
      gameSettings;

    if (expansions.includes("americas")) {
      return SCORE_CARD_CONFIGS.americas;
    }

    if (
      expansions.includes("asia")
    ) {
      return SCORE_CARD_CONFIGS.asia;
    }

    if (expansions.includes("oceania")) {
      return SCORE_CARD_CONFIGS.oceania;
    }

    return SCORE_CARD_CONFIGS.base;
  };

  const scoreCard = getScoreCard();

  const handleNewGame = () => {
    navigate("/lobby");
  };

  const handleReturnHome = () => {
    resetGameSettings();
    navigate("/");
  };
  console.log("Game Settings:", gameSettings);

  return (
    <Container fluid className="py-4">
      <h1 className="page-title text-center mb-4">
        Results
      </h1>

      <div className="score-sheet-container">
        <Image src={scoreCard.image} className="score-sheet-image" />

        {players.map((player, index) => (
          <div key={player.id}>
            {
              scoreCard.scorePositions.map((scorePosition, posIndex) => (
                <div
                  key={posIndex}
                  className={`score-overlay
                    ${
                      scorePosition.field === "playerName"
                        ? "player-name"
                        : ""
                    }
                    ${
                      scorePosition.field === "total"
                        ? "total-score"
                        : ""
                    }
                    ${
                      scorePosition.field === "nectarPlayed"
                        ? "nectar-played"
                        : ""
                  }`}
                  style={{
                    left: `${scoreCard.playerColumns[index]}%`,
                    top: `${scorePosition.position}%`,
                  }}
                >
                  {renderField(scorePosition.field, player, rankings[player.id])}
                </div>
              ))
            }
          </div>
        ))}
      </div>

      <Stack
        direction="horizontal"
        gap={3}
        className="justify-content-center mt-4"
      >
        <Button
          className="btn wingspan-btn py-3"
          onClick={handleReturnHome}
        >
          Return Home
        </Button>

        <Button
          className="btn wingspan-btn py-3"
          onClick={handleNewGame}
        >
          New Game
        </Button>
      </Stack>
    </Container>
  );
}

export default ResultsPage;