import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Card, Button, message } from "antd";
import axios from "axios";

const pinataApiKey = "ce0fb75180bb4ae9c877";  // Replace with your Pinata API key
const pinataSecretApiKey = "a820627343b427c5d162d4bc8d44758dc2ee79aeab4c6203665f586beea22b0f";

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const Selfie = ({ formData, setformData, handelStatus }) => {
  const webcamRef = useRef(null);
  const [buffer, setbuffer] = useState([null]);
  const [isLoading, setisLoading] = useState(false);

  const handleOk = () => {
    capture();
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    var file = dataURLtoFile(imageSrc, "selfie.png");
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      const newBuffer = [reader.result];
      setbuffer(newBuffer);
      message.success("Selfie Clicked");
    };
    // eslint-disable-next-line
  }, [webcamRef]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);
    try {
      const result = await uploadToPinata(buffer[0]);
      setisLoading(false);
      setformData({ ...formData, selfieIPFS: result.IpfsHash });
      handelStatus(3);
    } catch (error) {
      setisLoading(false);
      console.error(error);
      message.error("Something went wrong!");
    }
  };

  const uploadToPinata = async (fileBuffer) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    let data = new FormData();
    data.append('file', new Blob([fileBuffer], { type: 'application/octet-stream' }));

    const response = await axios.post(url, data, {
      maxContentLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretApiKey,
      },
    });

    return response.data;
  };

  return (
    <>
      <Card style={{ width: "40%", margin: "20px auto" }}>
        <Webcam style={{ width: "100%" }} ref={webcamRef} screenshotFormat="image/png" />
        <Button
          type="primary"
          style={{ display: "flex", margin: "auto" }}
          onClick={handleOk}
        >
          Click Selfie
        </Button>
      </Card>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          type="ghost"
          style={{ margin: "0 10px" }}
          onClick={() => handelStatus(1)}
        >
          Back
        </Button>
        <Button
          type="primary"
          style={{ margin: "0 10px" }}
          onClick={handleSubmit}
          loading={isLoading}
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default Selfie;
