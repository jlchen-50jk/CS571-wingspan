import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function LandingPage() {

    let navigate = useNavigate();

    return <div>
        <h1>Windspan Scoreboard</h1>
        <div className="d-grid gap-3 px-5">
            <Button variant="outline-primary" className="py-4" onClick={() => navigate("/game-settings")}>
                Create Game
            </Button>
            <Button variant="outline-primary" className="py-4" onClick={() => navigate("/lobby")}>
                Join Game
            </Button>
        </div>
    </div>;
}

export default LandingPage;
