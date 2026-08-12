import { Container, Form, Row, Col, Button, Modal, Spinner } from "react-bootstrap";
import { useGame } from "../context/GameContext";
import { useNavigate } from "react-router-dom";
import { SCORE_CATEGORIES } from "../data/scoreCategories";
import { useEffect, useState } from "react";
import { saveScores, loadScores, subscribeToScores, unsubscribe, goToResults, subscribeToGames, loadGame } from "../services/gameService";

function FinalScorePage() {
  let navigate = useNavigate();
  
  const {
    gameSettings,
    gameSession,
    updatePlayerScores,
    loadGameSettings,
    hydrateGame,
  } = useGame();

  const currentPlayerId = parseInt(sessionStorage.getItem("playerId"));
  const gameId = sessionStorage.getItem("gameId");
  const playerDbId = sessionStorage.getItem("playerDbId");

  useEffect(() => {

    if (
      gameSettings.players.length > 0
    ) {
      return;
    }

    if (!gameId) {
      return;
    }

    hydrateGame(gameId);

  }, []);

  async function refreshGame() {

  try {

    const {
      data,
      error,
    } = await loadGame(gameId);

    if (error) {
      throw error;
    }

    loadGameSettings(data);

  } catch (err) {

    console.error(
      "Failed to refresh game",
      err
    );

  }

}
  const currentPlayer = gameSettings.players.find(player => player.id === currentPlayerId);

  const [waitingForPlayers, setWaitingForPlayers] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const calculateScore = (value) => {
    if (!value) {
      return 0;
    }

    if (!/^[0-9+\-*/() ]+$/.test(value)) {
      return 0;
    }

    try {
      return Function(
        `"use strict"; return (${value})`
      )();
    } catch {
      return 0;
    }
  };

  const updateScore = (field, value) => {
    updatePlayerScores(currentPlayer.id, {
      ...currentPlayer.scores,
      [field]: value,
    });
  };

  const totalScore =
    calculateScore(currentPlayer?.scores?.birdPoints) +
    calculateScore(currentPlayer?.scores?.bonusCards) +
    calculateScore(currentPlayer?.scores?.roundGoals) +
    calculateScore(currentPlayer?.scores?.eggs) +
    calculateScore(currentPlayer?.scores?.cachedFood) +
    calculateScore(currentPlayer?.scores?.tuckedCards) +
    calculateScore(currentPlayer?.scores?.nectarPoints);

  const handleSubmitScore =
  async () => {
    try {

        console.log(
  "Submitting scores",
  playerDbId,
  currentPlayer.scores
);

const result =
  await saveScores(
    playerDbId,
    currentPlayer.scores
  );

console.log(
  "saveScores result",
  result
);

const { error } = result;

      if (error) {
        throw error;
      }

      setWaitingForPlayers(true);
      setSubmitted(true);
    } catch (err) {
      console.error(
        "Failed to submit scores",
        err
      );
    }
  };

const updateNectarScore = (habitat, value) => {
  updatePlayerScores(currentPlayer.id, {
    ...currentPlayer.scores,

    nectar: {
      ...currentPlayer.scores.nectar,
      [habitat]: value,
    },
  });
};

  useEffect(() => {

    if (
      gameSettings.status ===
      "results"
    ) {
      navigate("/results");
    }

  }, [
    gameSettings.status,
    navigate,
  ]);

  useEffect(() => {

    const channel =
      subscribeToGames(
        gameId,
        refreshGame
      );

    return () => {
      unsubscribe(channel);
    };

  }, [gameId]);

  useEffect(() => {
    if (!waitingForPlayers) {
      return;
    }

    async function checkScores() {

      try {

        const {
          data,
          error,
        } = await loadScores(
          gameId
        );

        if (error) {
          throw error;
        }

        const submittedPlayers =
          data.filter(
            (score) =>
              score.submitted
          );

        console.log(
          "Submitted:",
          submittedPlayers.length,
          "Expected:",
          gameSettings.players.length
        );

        if (
          submittedPlayers.length ===
          gameSettings.players.length
        ) {

          if (
            currentPlayerId === 1
          ) {

            await goToResults(
              gameId
            );

          }

        }

      } catch (err) {

        console.error(err);

      }

    }

    checkScores();

    const channel =
      subscribeToScores(
        checkScores
      );

    return () => {
      unsubscribe(channel);
    };

  }, [
    waitingForPlayers,
    gameId,
    gameSettings.players.length,
    currentPlayerId,
  ]);

  console.log("gameSettings", gameSettings)
  console.log(
    "Saving hummingbirds",
    currentPlayer?.scores?.hummingbirds
  );
  

  const hasRoundGoalScore =
  !!currentPlayer?.scores
    ?.roundGoalBreakdown;

  if (
    !currentPlayer &&
    gameSettings.players.length === 0
  ) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

console.log(
  "Current Player Scores",
  currentPlayer?.scores
);

  return (
    <Container className="py-4">
      <h1 className="page-title text-center mb-4">Final Scoring Calculator</h1>

      <Form>
        {SCORE_CATEGORIES.map((scoreRow) => (
          <Row key={scoreRow.key} className="align-items-center mb-3">
            <Col xs={5}><strong>{scoreRow.label}</strong></Col>
            {scoreRow.key === "roundGoals" ? (

              hasRoundGoalScore ? (

                <>
                  <Col xs={5}>
                    <Form.Control
                      readOnly
                      disabled
                      value={
                        currentPlayer?.scores
                          ?.roundGoalBreakdown ?? ""
                      }
                    />
                  </Col>

                  <Col xs={2}>
                    <strong>
                      {
                        currentPlayer?.scores
                          ?.roundGoals ?? 0
                      }
                    </strong>
                  </Col>
                </>

              ) : (

                <>
                  <Col xs={5}>
                    <Form.Control
                      value={
                        currentPlayer?.scores
                          ?.roundGoals ?? ""
                      }
                      placeholder={
                        scoreRow.placeholder
                      }
                      onChange={(e) =>
                        updateScore(
                          scoreRow.key,
                          e.target.value
                        )
                      }
                    />
                  </Col>

                  <Col xs={2}>
                    <strong>
                      {calculateScore(
                        currentPlayer?.scores
                          ?.roundGoals
                      )}
                    </strong>
                  </Col>
                </>

              )

            ) : scoreRow.type === "nectar" ? (
              <Col xs={5}>
                <Row className="g-2">
                  <Col>
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="Forest"
                      value={currentPlayer?.scores?.nectar?.forest ?? ""}
                      onChange={(e) =>updateNectarScore("forest",e.target.value)}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="Grassland"
                      value={currentPlayer?.scores?.nectar?.grassland ?? ""}
                      onChange={(e) => updateNectarScore("grassland", e.target.value)}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="Wetland"
                      value={currentPlayer?.scores?.nectar?.wetland ?? ""}
                      onChange={(e) => updateNectarScore("wetland", e.target.value)}
                    />
                  </Col>
                </Row>
              </Col>
            ) : (
              <>
                <Col xs={5}>
                  <Form.Control
                    value={currentPlayer?.scores?.[scoreRow.key] ?? ""}
                    placeholder={scoreRow.placeholder}
                    onChange={(e) => updateScore(scoreRow.key, e.target.value)}
                  />
                </Col>
                <Col xs={2}><strong>
                    {calculateScore(currentPlayer?.scores?.[scoreRow.key])}
                </strong></Col>
              </>
            )}
          </Row>
        ))}
      </Form>

      <hr />

      <div className="text-center">
        <Button
          className="btn wingspan-btn py-3"
          size="lg"
          onClick={handleSubmitScore}
          disabled={submitted}
        >
          Submit Score
        </Button>
      </div>
      <Modal
        show={waitingForPlayers}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Body className="text-center py-5">

          <Spinner
            animation="border"
            className="mb-3"
          />

          <h4>
            Waiting For Players
          </h4>

          <p>
            Waiting for everyone to
            submit their scores...
          </p>

        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default FinalScorePage;