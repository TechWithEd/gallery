import { Button } from "react-bootstrap";
import CenteredContainer from "./ui/CenteredContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import File from "../types/File";
import useEventListener from "../hooks/useEventListener";
import {
  faFileDownload,
  faTrash,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { useLayoutEffect } from "react";

library.add(faX, faTrash);

type PhotoViewerProps = {
  files: File[] | undefined;
  index: number;
  closePhotoViewer: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  deleteFile: () => void;
  fileNameColor: string;
};

export default function PhotoViewer({
  closePhotoViewer,
  files,
  index,
  moveLeft,
  moveRight,
  deleteFile,
  fileNameColor,
}: PhotoViewerProps) {
  if (files === undefined) return <></>;

  useEventListener("keydown", (e: KeyboardEvent) => {
    if (e.keyCode === 27) {
      closePhotoViewer();
    } else if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 39) {
      moveRight();
    }
  });

  return (
    <>
      <Button onClick={closePhotoViewer} className="m-2">
        <FontAwesomeIcon icon={"x"} />
      </Button>
      <Button onClick={deleteFile}>
        <FontAwesomeIcon icon={"trash"} />
      </Button>
      <CenteredContainer>
        <p
          style={{
            fontWeight: "bold",
            color: fileNameColor,
            fontSize: "15px",
            margin: "2.5px",
            textAlign: "center",
          }}
        >
          {files[index].name.substr(0, files[index].name.lastIndexOf("."))}
        </p>
        <div style={{ display: "flex" }}>
          <Button onClick={moveLeft} className="ms-2 me-2">
            {"<"}
          </Button>
          <img
            style={{
              objectFit: "scale-down",
              width: "75%",
              height: "75%",
            }}
            src={files[index].downloadUrl}
          />
          <Button onClick={moveRight} className="ms-2 me-2">
            {">"}
          </Button>
        </div>
      </CenteredContainer>
    </>
  );
}
