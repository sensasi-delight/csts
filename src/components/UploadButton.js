import Button from "@material-ui/core/Button";
import ImageIcon from "@material-ui/icons/Image";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';

import ApiHandler from "../classes/ApiHandler";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import imageCompression from 'browser-image-compression';
import { Dialog, DialogContent, IconButton, Slide, Typography } from "@material-ui/core";
import { useState, forwardRef } from "react";
import Webcam from "react-webcam";
import { useEffect } from "react";
import { useCallback } from "react";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const COMPRESS_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true
}

export default function UploadButton({ setIsImagesUploading, processObj }) {

  const handleImagesUpload = (e) => {
    setIsImagesUploading(true);

    const nImages = e.target.files.length;
    let nUploadedImage = 0;

    [...e.target.files].map(async file => {

      const compressedFile = new File([await imageCompression(file, COMPRESS_OPTIONS)], file.name);
      return uploadFile(compressedFile)
        .then(() => {
          nUploadedImage++
          if (nUploadedImage === nImages) {
            setIsImagesUploading(false)
          }
        })
    })
  }

  const uploadFile = async file => {
    const formData = new FormData()
    formData.append('imgFile', file)

    return ApiHandler.uploadImage(formData)
      .then(response => response.json())
      .then(response => {

        if (!processObj.imgPaths) {
          processObj.imgPaths = []
        }

        let imgPath = response.data

        if (response.message === 'only jpg, png, and bmp are allowed') {
          imgPath = 'image/default/warning/extension_error_warning.png'
        }

        processObj.imgPaths.push(imgPath)
      })
  }

  const handleCameraUpload = async dataUri => {

    let blob;
    
    setIsImagesUploading(true);


    await fetch(dataUri)
      .then(res => res.blob())
      .then(blobRes => {
        blob = blobRes;
      })

    const compressedFile = new File([await imageCompression(blob, COMPRESS_OPTIONS)], 'Captured Image.jpg');

    return uploadFile(compressedFile).then(() => {
      setIsImagesUploading(false)
    })
  }


  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [dataUri, setDataUri] = useState('');

  const [devices, setDevices] = useState([]);
  const [isMirrored, setIsMirrored] = useState(false);

  const [videoConstraints, setVideoConstraints] = useState({});
  const [selectedDeviceId, setSelectedDeviceId] = useState(0);

  const handleDevices = useCallback(
    mediaDevices =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  useEffect(
    () => {
      navigator.mediaDevices.enumerateDevices().then(handleDevices);
    },
    [handleDevices]
  );

  const handleFlipCamera = () => {
    let temp = selectedDeviceId + 1;

    if (temp >= devices.length) {
      temp = 0;
    }

    setSelectedDeviceId(temp)
    setVideoConstraints({
      deviceId: devices[temp].deviceId
    })
  }

  const isMirroredCamera = () => {
    return ['webcam', 'web cam', 'front'].some(name => devices[selectedDeviceId].label.toLowerCase().includes(name))
  }

  return (
    <>
      <Typography variant="body2" component="p">Tambah foto dari: </Typography>
      <Button color="primary" component="label" startIcon={<ImageIcon />}>
        Galeri
        <input
          accept="image/*"
          type="file"
          multiple
          onChange={handleImagesUpload}
          hidden
        />
      </Button>

      <Button
        color="primary"
        startIcon={<CameraAltIcon />}
        onClick={() => setIsCameraOpen(true)}
        style={{
          marginLeft: '3em'
        }}
      >
        Kamera
      </Button>

      <Dialog fullScreen
        open={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        TransitionComponent={Transition}

      >


        <div style={{
          backgroundColor: 'black',
          height: '100%'
        }}>

          {
            dataUri
              ? <>
                <img src={dataUri} alt="Foto Kamera" width="100%" />

                <IconButton
                  aria-label="cancel"
                  onClick={() => setDataUri(null)}
                  children={<CancelIcon style={{ fontSize: '4em' }} />}
                  color="secondary"
                  style={{
                    position: 'absolute',
                    bottom: '.3em',

                    left: '25%',

                    marginRight: '1em'
                  }}
                />

                <IconButton
                  aria-label="accept"
                  onClick={() => {
                    handleCameraUpload(dataUri)
                    setIsCameraOpen(false)
                  }}
                  children={<CheckCircleIcon style={{ fontSize: '4em' }} />}
                  style={{
                    color: "#4caf50",
                    position: 'absolute',
                    bottom: '.3em',

                    right: '25%',

                    marginLeft: '1em'
                  }}
                />
              </>
              : <Webcam
                mirrored={isMirrored}
                onUserMedia={() => {
                  setIsMirrored(isMirroredCamera())
                }}
                audio={false}
                // allowFullScreen={true}

                style={{
                  width: '100%'
                }}
                screenshotFormat="image/jpeg"
                // width={1280}
                videoConstraints={videoConstraints}
              >
                {({ getScreenshot }) => (
                  <>
                    <IconButton
                      aria-label="back"
                      onClick={() => setIsCameraOpen(false)}
                      children={<ArrowBackIcon fontSize="large" />}
                      style={{
                        position: 'absolute',
                        left: '.3em',
                        top: '.3em',
                        color: "aliceblue"
                      }}
                    />

                    <IconButton
                      aria-label="capture"
                      onClick={() => setDataUri(getScreenshot())}
                      children={<FiberManualRecordIcon style={{ fontSize: '4em' }} />}
                      color="secondary"
                      style={{
                        position: 'absolute',
                        bottom: '.3em',
                        // alignSelf: "center"
                        left: '50%',
                        right: '50%',

                      }}
                    />

                    <IconButton
                      aria-label="change camera"
                      onClick={() => handleFlipCamera()}
                      children={<FlipCameraIosIcon style={{ fontSize: '3em' }} />}
                      color="secondary"
                      style={{
                        position: 'absolute',
                        bottom: '1em',
                        right: '1em',
                        color: "aliceblue"
                      }}
                    />
                  </>

                )}
              </Webcam>
          }

        </div>


      </Dialog>
    </>
  )

}