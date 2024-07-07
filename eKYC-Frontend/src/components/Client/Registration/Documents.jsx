import { Button, Form, Input, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import axios from "axios";

const pinataApiKey = "ce0fb75180bb4ae9c877";  // Replace with your Pinata API key
const pinataSecretApiKey = "a820627343b427c5d162d4bc8d44758dc2ee79aeab4c6203665f586beea22b0f";

const Documents = ({ formData, setformData, handelStatus }) => {
  const [buffer, setbuffer] = useState([null, null]);
  const [isLoading, setisLoading] = useState(false);

  const handelNext = async () => {
    if (buffer[0] && buffer[1]) {
      setisLoading(true);
      try {
        const results = await Promise.all(buffer.map(uploadToPinata));
        setisLoading(false);
        setformData({
          ...formData,
          panIPFS: results[0].IpfsHash,
          aadharIPFS: results[1].IpfsHash,
        });
        handelStatus(2);
      } catch (error) {
        setisLoading(false);
        console.error(error);
        message.error("Something went wrong!");
      }
    } else {
      message.error("Please choose Documents");
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

  const captureFile = (e, i) => {
    const file = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      const newBuffer = [...buffer];
      newBuffer[i] = reader.result;
      setbuffer(newBuffer);
    };
  };

  return (
    <>
      <Form layout="vertical" style={{ margin: "50px auto", width: "30%" }}>
        <Form.Item label="PAN Card">
          <Input
            type="file"
            suffix={<UploadOutlined />}
            required
            onChange={(e) => captureFile(e, 0)}
          />
        </Form.Item>
        <Form.Item label="Aadhar Card">
          <Input
            type="file"
            suffix={<UploadOutlined />}
            required
            onChange={(e) => captureFile(e, 1)}
          />
        </Form.Item>
      </Form>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          type="ghost"
          style={{ margin: "0 10px" }}
          onClick={() => handelStatus(0)}
        >
          Back
        </Button>
        <Button
          type="primary"
          style={{ margin: "0 10px" }}
          onClick={handelNext}
          loading={isLoading}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default Documents;
