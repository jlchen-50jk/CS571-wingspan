import { Container, Stack, Button, Modal, Form, Spinner } from "react-bootstrap";

import { useGame } from "../context/GameContext";
import { ROUND_GOAL_SCORING } from "../data/roundGoalScoring";
import SelectionCard from "../components/SelectionCard";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { nextRound, goToScoring, saveRoundGoalResult, loadRoundGoalResults, updateRoundGoalResult, subscribeToRoundGoalResults, unsubscribe, subscribeToGames, loadGame } from "../services/gameService";

function RoundPage() {
  let navigate = useNavigate();
  const gameId = sessionStorage.getItem("gameId");
  //State Variables
  const {gameSettings, advanceRound, loadGameSettings} = useGame();
  const [roundEnd, setRoundEnd] = useState(false);
  const [showCountModal, setShowCountModal] = useState(false);

  const [ waitingForPlayers, setWaitingForPlayers] = useState(false);

  const [
    goalCount,
    setGoalCount
  ] = useState("");

  const [
    roundResult,
    setRoundResult
  ] = useState(null);

  const [
  showResultModal,
  setShowResultModal
] = useState(false);

  const playerDbId =
    sessionStorage.getItem(
      "playerDbId"
    );

  const playerId =
    Number(
      sessionStorage.getItem(
        "playerId"
      )
    );

    const round =
      gameSettings.currentRound;

    const roundGoal =
      gameSettings.goals[round];

  const handleEndRound =
    async () => {

      setShowResultModal(
        false
      );

      await nextRound(
        gameId,
        gameSettings.currentRound
      );

    };

  async function handleEndGame() {

    setShowResultModal(
      false
    );

    const { error } =
      await goToScoring(
        gameId
      );

    if (error) {
      console.error(error);
    }

  }

      useEffect(() => {

      if (
        gameSettings.status ===
        "scoring"
      ) {
        navigate("/scoring");
      }

    }, [
      gameSettings.status,
      navigate,
    ]);

    useEffect(() => {

      if (
        !waitingForPlayers
      ) {
        return;
      }

      async function
      checkRoundResults() {

        const {
          data,
          error,
        } =
          await loadRoundGoalResults(
            gameId,
            round
          );

        if (
          error
        ) {
          console.error(
            error
          );

          return;
        }

        const submitted =
          data.filter(
            (
              result
            ) =>
              result.submitted
          );

        if (
          submitted.length ===
          gameSettings
            .players
            .length
        ) {

          if (
            playerId === 1
          ) {

            const alreadyResolved =
              submitted.some(
                (
                  result
                ) =>
                  result.resolved
              );

            if (
              !alreadyResolved
            ) {

              await resolveRoundGoalResults();
              await loadMyRoundResult();
              

            }

          }

          const myResult =
            submitted.find(
              (result) =>
                result.player_id ===
                  playerDbId &&
                result.resolved
            );

          if (myResult) {

            setWaitingForPlayers(
              false
            );

            setRoundResult(
              myResult
            );

            setShowResultModal(
              true
            );

          }

        }

      }

      checkRoundResults();

      const channel =
        subscribeToRoundGoalResults(
          checkRoundResults
        );

      return () =>
        unsubscribe(channel);

    }, [
      waitingForPlayers,
      gameId,
      round,
    ]);

    async function refreshGame() {

  const {
    data,
    error,
  } = await loadGame(gameId);

  if (error) {
    console.error(error);
    return;
  }

  loadGameSettings(data);

}

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

    async function handleSubmitGoalCount() {
      try {

        const { error } =
          await saveRoundGoalResult(
            gameId,
            playerDbId,
            round,
            Number(goalCount)
          );

        if (error) {
          throw error;
        }

        setShowCountModal(
          false
        );

        setWaitingForPlayers(
          true
        );

      } catch (err) {

        console.error(err);

      }

    }
    async function resolveRoundGoalResults() {
      const {
        data,
        error,
      } =
        await loadRoundGoalResults(
          gameId,
          round
        );

      if (error) {
        throw error;
      }

      const scoring =
        gameSettings.playerCount > 5
          ? ROUND_GOAL_SCORING.asia
          : ROUND_GOAL_SCORING.standard;

      const roundScore =
        scoring[
          `round${round}`
        ];

      const ranks =
        Object.values(
          roundScore
        );

      const grouped =
        Object.values(
          data.reduce(
            (acc, result) => {

              const count =
                result.goal_count;

              acc[count] =
                acc[count] ?? [];

              acc[count]
                .push(result);

              return acc;

            },
            {}
          )
        )
          .sort(
            (a, b) =>
              b[0].goal_count -
              a[0].goal_count
          );

      let
        startingPosition = 0;

      for (
        const group
        of grouped
      ) {

        const positions =
          ranks.slice(
            startingPosition,
            startingPosition +
              group.length
          );

        const points =
          Math.floor(
            positions.reduce(
              (
                sum,
                value
              ) =>
                sum + value,
              0
            ) /
              group.length
          );

        let rankText;

        if (
          group.length > 1
        ) {

          rankText =
            `Tied ${startingPosition + 1}`;

        } else {

          rankText =
            `${startingPosition + 1}`;

        }

        for (
          const result
          of group
        ) {

          await updateRoundGoalResult(
            result.id,
            {
              points,

              rank_text:
                rankText,

              resolved:
                true,
            }
          );

        }

        startingPosition +=
          group.length;
      }

    }
  async function loadMyRoundResult() {

    const {
      data,
    } =
      await loadRoundGoalResults(
        gameId,
        round
      );

    const mine =
      data.find(
        (
          result
        ) =>
          result.player_id ===
          playerDbId &&
          result.resolved
      );

    if (
      mine
    ) {

      setWaitingForPlayers(
        false
      );

      setRoundResult(
        mine
      );

      setShowResultModal(
        true
      );

    }

  }
  
  //TODO: Handle score tracking - game setting will have round scores added.
  return <Container className="py-4">
    <h1 className="page-title text-center mb-4">Round {round}</h1>

    <div className="d-flex justify-content-center mb-4">
      <div style={{ width: "250px" }}>
        <SelectionCard
          className="selected"
          image={roundGoal?.image}
        />
      </div>
    </div>

    <div className="text-center mb-5">
      {
        roundEnd ? <h4>Round {round} Scoring</h4> : <h4>Round {round} In Progress</h4>
      }
    </div>

    <Stack
      direction="horizontal"
      gap={3}
      className="justify-content-center"
    >
      <Button
        className="btn wingspan-btn py-3"
        onClick={() =>
          navigate("/")
        }
      >
        Leave Game
      </Button>
      { 
        roundEnd ? <Button className="btn wingspan-btn py-3" onClick={round < 4 ? handleEndRound : handleEndGame}>
          {round < 4 ? `Advance to Round ${round + 1}` : "End Game"}
        </Button> : <Button className="btn wingspan-btn py-3" onClick={() => setShowCountModal(true)}>
          End Round
        </Button>
      }
    </Stack>
    <Modal
      show={showCountModal}
      centered
    >
      <Modal.Header>
        <Modal.Title>
          Round Goal Count
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>

        <Form.Control
          type="number"
          min="0"
          value={goalCount}
          onChange={(e) =>
            setGoalCount(
              e.target.value
            )
          }
        />

      </Modal.Body>

      <Modal.Footer>

        <Button
          onClick={
            handleSubmitGoalCount
          }
        >
          Submit
        </Button>

      </Modal.Footer>

    </Modal>
    
    <Modal
      show={waitingForPlayers}
      backdrop="static"
      centered
    >
      <Modal.Body
        className="text-center"
      >

        <Spinner />

        <h4>
          Waiting For Players
        </h4>

      </Modal.Body>

    </Modal>
    <Modal
      show={showResultModal}
      centered
    >
      <Modal.Header>

        <Modal.Title>
          Round Results
        </Modal.Title>

      </Modal.Header>

      <Modal.Body>

        <h5>
          Goal Count:
          {" "}
          {
            roundResult?.goal_count
          }
        </h5>

        <h5>
          Rank:
          {" "}
          {
            roundResult?.rank_text
          }
        </h5>

        <h5>
          Points:
          {" "}
          +
          {
            roundResult?.points
          }
        </h5>

      </Modal.Body>

      <Modal.Footer>

        {playerId === 1 ? (

          <Button
            onClick={
              round < 4
                ? handleEndRound
                : handleEndGame
            }
          >
            Continue
          </Button>

        ) : (

          <div>
            Waiting for host...
          </div>

        )}

      </Modal.Footer>

    </Modal>
  </Container>
}

export default RoundPage;