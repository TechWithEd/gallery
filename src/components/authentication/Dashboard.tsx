import {
  Alert,
  Button,
  Card,
  Container,
  Form,
  Nav,
  Navbar,
} from "react-bootstrap";
import app, {
  auth,
  database,
  firestore,
  storage,
} from "../../firebase/firebase";
import { deleteUser, getAuth, User } from "@firebase/auth";
import { reauthenticateWithCredential, signOut } from "firebase/auth";
import CenteredContainer from "../ui/CenteredContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faCross,
  faCrosshairs,
  faFileCirclePlus,
  faFileUpload,
  faHeart,
  faIcons,
  faPhotoFilm,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { icon, library } from "@fortawesome/fontawesome-svg-core";
import { FileError, useFilePicker } from "use-file-picker";
import LoadingScreen from "../pages/LoadingScreen";
import {
  deleteObject,
  listAll,
  ref,
  uploadBytes,
  uploadBytesResumable,
  uploadString,
} from "@firebase/storage";
import { getBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, doc } from "@firebase/firestore";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import DownloadLoadingScreen from "../pages/DownloadLoadingScreen";
import useLocalStorage from "../../hooks/useLocalStorage";
import useEventListener from "../../hooks/useEventListener";
import PhotoViewer from "../PhotoViewer";
import File from "../../types/File";

library.add(faFileUpload);

type DashboardProps = {
  user: User | null;
};

export default function Dashboard({ user }: DashboardProps) {
  const [
    openFileSelector,
    { filesContent, loading: filesContentloading, errors: filesContentsErrors },
  ] = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: true,
  });

  const [files, setFiles] = useState<File[] | undefined>();
  const [uploadFilesLoading, setUploadFilesLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [search, setSearch] = useState<string>("");
  const [percentage, setPercentage] = useState(0);
  const [openPhotoViewer, setOpenPhotoViewer] = useState(false);
  const [showFileName, setShowFileName] = useLocalStorage(
    "gallery-show-file-name",
    true
  );
  const filteredFiles = files
    ?.filter((f) =>
      f.name.substr(0, f.name.lastIndexOf(".")).includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.name.toLowerCase().includes("sana")) return -1;
      else if (b.name.toLowerCase().includes("sana")) return 1;
      return 0;
    });

  const [fileNameColor, setFileNameColor] = useLocalStorage(
    "gallery-file-name-color",
    "black"
  );

  useEffect(() => {
    if (user === null) return;

    filesContent.map(async (iter) => {
      let uploadTask = uploadBytesResumable(
        ref(storage, `/${user.uid}/${iter.name}`),
        dataURItoBlob(iter.content),
        {
          contentType: `image/${iter.name.substr(
            iter.name.lastIndexOf(".") + 1
          )}`,
        }
      );

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setPercentage(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          switch (snapshot.state) {
            case "paused":
              setUploadFilesLoading(false);
              break;
            case "running":
              setUploadFilesLoading(true);
              break;
          }
        },
        (error) => {},
        () => {
          setUploadFilesLoading(false);
        }
      );
    });
  }, [filesContent.length]);

  useEffect(() => {
    getFiles();
  });

  useLayoutEffect(() => {
    if (filteredFiles === undefined) return;

    if (openPhotoViewer) {
      document.title = filteredFiles[selectedPhoto].name.substr(
        0,
        filteredFiles[selectedPhoto].name.lastIndexOf(".")
      );
    } else {
      document.title = "gallery";
    }
  }, [openPhotoViewer, selectedPhoto]);

  function moveLeft() {
    if (filteredFiles === undefined) return;

    setSelectedPhoto((prev) => {
      if (prev <= 0) return filteredFiles.length - 1;
      return prev - 1;
    });
  }

  function moveRight() {
    if (filteredFiles === undefined) return;

    setSelectedPhoto((prev) => {
      if (prev >= filteredFiles.length - 1) return 0;
      return prev + 1;
    });
  }

  async function getFiles() {
    if (user === null) return;

    let { items } = await listAll(ref(storage, `/${user.uid}/`));
    let files = [];
    for (let i = 0; i < items.length; i++) {
      let downloadUrl: string = "";
      await getDownloadURL(ref(storage, items[i].fullPath)).then(
        (url) => (downloadUrl = url)
      );

      files.push({ name: items[i].name, downloadUrl });
    }

    setFiles([...files]);
  }

  function formatFileName(file: File) {
    let name = file.name.substr(0, file.name.lastIndexOf("."));
    if (name.length > 12) {
      return name.substr(0, 9) + "...";
    } else {
      return name;
    }
  }

  function dataURItoBlob(dataURI: string) {
    var byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0) {
      byteString = atob(dataURI.split(",")[1]);
    } else {
      byteString = unescape(dataURI.split(",")[1]);
    }
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  }

  if (user === null) {
    window.location.pathname = "/signup";
  }

  if (filesContentloading || files === undefined) {
    return <LoadingScreen />;
  }

  if (uploadFilesLoading) {
    return <DownloadLoadingScreen percentage={percentage} />;
  }

  if (filesContentsErrors.length) {
    return (
      <div>
        {filesContentsErrors.map((error: FileError, index: number) => (
          <p key={index}>{JSON.stringify(error)}</p>
        ))}
      </div>
    );
  }

  return openPhotoViewer ? (
    <PhotoViewer
      closePhotoViewer={() => setOpenPhotoViewer(false)}
      moveLeft={moveLeft}
      moveRight={moveRight}
      deleteFile={() => {
        if (filteredFiles === undefined || user === null) return;
        let file = filteredFiles[selectedPhoto];
        deleteObject(ref(storage, `/${user.uid}/${file.name}`));
      }}
      files={filteredFiles}
      index={selectedPhoto}
      fileNameColor={fileNameColor}
    />
  ) : (
    <div>
      <div
        className="row"
        style={{
          backgroundColor: "rgb(245, 245, 245)",
          marginBottom: "50px",
        }}
      >
        <div style={{ margin: "15px" }}>
          <Navbar>
            <Nav.Item>
              <Nav.Link className="p-2" href="/profile">
                {user?.email}
              </Nav.Link>
            </Nav.Item>
          </Navbar>
          <Button
            className="outline-success"
            style={{ width: "37.5px", margin: "5px" }}
            onClick={() => {
              openFileSelector();
            }}
          >
            <FontAwesomeIcon icon={"file-upload"} />
          </Button>
          <Form
            style={{
              marginTop: "15px",
              width: "90%",
            }}
            onSubmit={(e) => e.preventDefault()}
          >
            <Form.Group>
              <Form.Control
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                type="search"
              />
              <Form.Check
                style={{
                  marginTop: "25px",
                }}
                inline
                label="Show File Names"
                checked={showFileName}
                onChange={(e) => {
                  setShowFileName(e.target.checked);
                }}
              />
              {showFileName ? (
                <Form.Control
                  style={{ marginTop: "25px" }}
                  value={fileNameColor}
                  onChange={(e) => setFileNameColor(e.target.value)}
                  type="color"
                />
              ) : (
                <></>
              )}
            </Form.Group>
          </Form>
        </div>
      </div>
      <div style={{ marginLeft: "25px" }}>
        {filteredFiles?.map((file, index) => (
          <Button
            key={index}
            onClick={() => {
              setOpenPhotoViewer(true);
              setSelectedPhoto(index);
            }}
            className="badge bg-light btn-dark"
            style={{
              borderWidth: "1px",
              margin: "1px",
              width: "30%",
              height: "30%",
            }}
          >
            <div
              style={{
                borderWidth: "5px",
                borderColor: "black",
                marginBottom: "12.5%",
                marginTop: "12.5%",
              }}
            >
              <img
                style={{
                  objectFit: "scale-down",
                  width: "75%",
                  height: "75%",
                }}
                src={file.downloadUrl}
              />
            </div>
            {showFileName ? (
              <p
                style={{
                  color: fileNameColor,
                  fontSize: "15px",
                  margin: "2.5px",
                }}
              >
                {formatFileName(file)}
              </p>
            ) : (
              <></>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
