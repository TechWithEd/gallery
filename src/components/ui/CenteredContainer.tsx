import React from "react";
import { Container } from "react-bootstrap";

type CenteredContainerProps = {
  children: any;
};

export default function CenteredContainer({
  children,
}: CenteredContainerProps) {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        {children}
      </div>
    </Container>
  );
}
