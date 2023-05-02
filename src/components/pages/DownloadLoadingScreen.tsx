import React from "react";
import { Button } from "react-bootstrap";
import CenteredContainer from "../ui/CenteredContainer";

type DownloadLoadingScreenProps = {
  percentage: number;
};

export default function DownloadLoadingScreen({
  percentage,
}: DownloadLoadingScreenProps) {
  if (percentage < 0 || percentage > 100) return <></>;

  return (
    <>
      <CenteredContainer>
        <Button
          style={{
            width: "50%",
            height: "50px",
            position: "absolute",
            borderRadius: "10px",
            borderWidth: "5px",
            borderColor: "black",
            left: "25%",
            backgroundColor: "white",
          }}
        />
        {percentage === 0 ? null : (
          <Button
            style={
              percentage === 100
                ? {
                    width: `${percentage / 2}%`,
                    height: "50px",
                    position: "absolute",
                    borderRadius: "10px",
                    borderWidth: "5px",
                    borderColor: "black",
                    left: "25%",
                    backgroundColor: "limegreen",
                  }
                : {
                    width: `${percentage / 2}%`,
                    height: "50px",
                    position: "absolute",
                    borderTopLeftRadius: "10px",
                    borderBottomLeftRadius: "10px",
                    borderWidth: "5px",
                    borderColor: "black",
                    left: "25%",
                    backgroundColor: "limegreen",
                  }
            }
          >
            <p
              style={{
                fontSize: "15px",
                marginLeft: "90%",
                margin: "5px",
              }}
            >
              {Math.round(percentage)}%
            </p>
          </Button>
        )}
      </CenteredContainer>
    </>
  );
}
