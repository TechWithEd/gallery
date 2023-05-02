import { CSSProperties } from "react";
import CenteredContainer from "../ui/CenteredContainer";
import "./LoadingScreen.css";

export default function LoadingScreen() {
  return (
    <CenteredContainer>
      <div className="loader" style={{ marginLeft: "120px" }} />
    </CenteredContainer>
  );
}
