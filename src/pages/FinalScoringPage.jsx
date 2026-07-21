import { Container, Form, Row, Col, Button } from "react-bootstrap";

import PageHeader from "../components/PageHeader";
import { useGame } from "../context/GameContext";
import { useNavigate } from "react-router-dom";

function FinalScorePage() {
  let navigate = useNavigate();
  
  const {
    gameSettings,
    gameSession,
    updatePlayerScores,
  } = useGame();

  console.log("Game Settings:", gameSettings); //TODO: Remove this debug log after confirming gameSettings is correct

  const currentPlayer = gameSettings.players[0]; //TODO: Remove assumption: Assuming the first player is the current player for scoring

  console.log("Current Player:", currentPlayer); //TODO: Remove this debug log after confirming the current player is correct

  const scores = currentPlayer?.scores ?? {
    birdPoints: "",
    bonusCards: "",
    roundGoals: "",
    eggs: "",
    cachedFood: "",
    tuckedCards: "",
    nectarPoints: "",
  };

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
      ...scores,
      value,
    });
  };

  const totalScore =
    calculateScore(scores.birdPoints) +
    calculateScore(scores.bonusCards) +
    calculateScore(scores.roundGoals) +
    calculateScore(scores.eggs) +
    calculateScore(scores.cachedFood) +
    calculateScore(scores.tuckedCards) +
    calculateScore(scores.nectarPoints);

  const handleSubmitScore = () => {
    navigate("/results");
  };

  const scoreRows = [
    {
      key: "birdPoints",
      label: "Bird Points",
      placeholder: "3+4+5+2",
    },
    {
      key: "bonusCards",
      label: "Bonus Cards",
      placeholder: "3+2",
    },
    {
      key: "roundGoals",
      label: "Round End Goals",
      placeholder: "5+4+3",
    },
    {
      key: "eggs",
      label: "Eggs",
      placeholder: "14",
    },
    {
      key: "cachedFood",
      label: "Cached Food",
      placeholder: "7",
    },
    {
      key: "tuckedCards",
      label: "Tucked Cards",
      placeholder: "12",
    },
    {
      key: "nectarPoints",
      label: "Nectar",
      placeholder: "6",
    },
  ];

  return (
    <Container className="py-4">
      <PageHeader
        title="Final Scoring"
        subtitle={currentPlayer?.name}
      />

      <Form>
        {scoreRows.map((row) => (
          <Row
            key={row.key}
            className="align-items-center mb-3"
          >
            <Col xs={5}>
              <strong>{row.label}</strong>
            </Col>

            <Col xs={5}>
              <Form.Control
                value={scores[row.key]}
                placeholder={row.placeholder}
                onChange={(e) =>
                  updateScore(
                    row.key,
                    e.target.value
                  )
                }
              />
            </Col>

            <Col xs={2}>
              <strong>
                {calculateScore(
                  scores[row.key]
                )}
              </strong>
            </Col>
          </Row>
        ))}
      </Form>

      <hr />

      <Row className="align-items-center mb-4">
        <Col xs={10}>
          <h4>Total Score</h4>
        </Col>

        <Col xs={2}>
          <h4>{totalScore}</h4>
        </Col>
      </Row>

      <div className="text-center">
        <Button
          className="btn wingspan-btn py-3"
          size="lg"
          onClick={handleSubmitScore}
        >
          Submit Score
        </Button>
      </div>
    </Container>
  );
}

export default FinalScorePage;