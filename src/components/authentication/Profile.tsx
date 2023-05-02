import { Alert, Button, Card } from "react-bootstrap";
import app, { auth } from "../../firebase/firebase";
import { deleteUser, getAuth, User } from "@firebase/auth";
import { reauthenticateWithCredential, signOut } from "firebase/auth";
import CenteredContainer from "../ui/CenteredContainer";

// TODO: add delete and update profile buttons

type ProfileProps = {
  user: User | null;
};

export default function Profile({ user }: ProfileProps) {
  if (user === null) {
    window.location.pathname = "/signup";
  }

  return (
    <CenteredContainer>
      <Card>
        <Card.Body>
          <h2 style={{ fontWeight: "bold" }} className="text-center mb-4">
            Profile
          </h2>
          <strong>Email:</strong> {user?.email}
          <Button
            onClick={() => signOut(auth)}
            className="btn btn-primary w-100 mt-3"
          >
            Log out
          </Button>
        </Card.Body>
      </Card>
    </CenteredContainer>
  );
}
