import { Container, Stack, Button, Modal, Form, Spinner } from "react-bootstrap";

import { useGame } from "../context/GameContext";
import { ROUND_GOAL_SCORING } from "../data/roundGoalScoring";
import SelectionCard from "../components/SelectionCard";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { nextRound, goToScoring, saveRoundGoalResult, loadRoundGoalResults, updateRoundGoalResult, subscribeToRoundGoalResults, unsubscribe, subscribeToGames, loadGame, startRoundScoring } from "../services/gameService";

function RoundPage() {
  let navigate = useNavigate();
  const gameId = sessionStorage.getItem("gameId");
  //State Variables
  const {gameSettings, advanceRound, loadGameSettings, hydrateGame} = useGame();
  
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

useEffect(() => {

  if (!gameId) {
    return;
  }

  hydrateGame(gameId);

}, [gameId]);

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

      setShowResultModal(false);
      setShowCountModal(false);
      setWaitingForPlayers(false);
      setRoundResult(null);
      setGoalCount("");

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

  async function handleStartRoundScoring() {

    setShowResultModal(false);
    setRoundResult(null);
    setGoalCount("");

    const { error } =
      await startRoundScoring(
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
        gameSettings.status ===
        "round_scoring"
      ) {

        setShowCountModal(
          true
        );

      }

    }, [
      gameSettings.status
    ]);

    useEffect(() => {

      async function
        checkRoundResults() {

          if (
            gameSettings.currentRound === 0 ||
            gameSettings.players.length === 0
          ) {
            return;
          }

          console.log(
            "Checking",
            {
              gameId,
              round:
                gameSettings.currentRound,
            }
          );

        const {
          data,
          error,
        } =
          await loadRoundGoalResults(
            gameId,
            gameSettings.currentRound
          );

        if (
          error
        ) {
          console.error(
            error
          );

          return;
        }

console.log(
  "Loading results for round",
  round,
  data
);

        const submitted =
          data.filter(
            (result) =>
              result.submitted
          );

          console.log(
  "Submitted:",
  submitted.length,
  "Expected:",
  gameSettings.players.length
);

        const mine =
          data.find(
            (result) =>
              result.player_id ===
              playerDbId
          );

          console.log(
  "Player DB Id:",
  playerDbId
);

console.log(
  "Mine:",
  mine
);
        
        if (
          mine?.resolved
        ) {


          console.log(
  "Mine resolved?",
  mine?.resolved
);
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

            }

          }

        }

      }


      console.log(
  "Loading results",
  {
    gameId,
    round
  }
);
      checkRoundResults();

      const channel =
        subscribeToRoundGoalResults(
          (payload) => {

            console.log(
              "Realtime event",
              payload
            );

            checkRoundResults();

          }
        );

      return () =>
        unsubscribe(channel);

      }, [
        gameId,
        gameSettings.currentRound,
        gameSettings.players.length,
      ]);

async function refreshGame() {

  await hydrateGame(gameId);

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

useEffect(() => {

  if (
    gameSettings.status === "round" &&
    showResultModal
  ) {

    setShowResultModal(false);

    setWaitingForPlayers(false);

    setShowCountModal(false);

    setRoundResult(null);

    setGoalCount("");

  }

}, [
  gameSettings.status,
  showResultModal,
]);

    async function handleSubmitGoalCount() {
      try {
        console.log(
  "Submitting",
  {
    gameId,
    playerDbId,
    round,
    goalCount,
  }
);
        const result =
          await saveRoundGoalResult(
            gameId,
            playerDbId,
            round,
            Number(goalCount)
          );

        console.log(
          "saveRoundGoalResult response",
          result
        );

        const { error } = result;

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

      console.log(
        "Resolving round",
        round
      );
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
      <h4>Round {round} In Progress</h4>
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
      {playerId === 1 && (
        (
          <Button
            className="btn wingspan-btn py-3"
            onClick={
              handleStartRoundScoring
            }
          >
            End Round
          </Button>
        )
      )}
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