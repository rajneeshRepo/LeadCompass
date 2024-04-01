import React, { useState, useEffect, useRef} from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Button, message, Upload, Card, Select, Typography } from "antd";
import UploadService from "services/UploadService";
import BlobService from "services/BlobService";
import { useNavigate } from "react-router-dom";

const {Title} = Typography

const { Dragger } = Upload;

const UploadLeads = () => {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [experiments, setExperiments] = useState([]);
  const [selectExperiment, setSelectedExperiment] = useState(null);

  const getExperiments = async (data) => {
    try {
      const response = await BlobService.config({status: 'bronze'});
      setExperiments(response["configs"]);
    } catch (error) {
      message.error("Couldn't fetch configs");
    }
  };

  useEffect(() => {
    getExperiments();
  }, []);

  const handleUpload = async () => {
    console.log("Handle Upload");
    console.log(fileList);
    const formData = new FormData();
    console.log(selectExperiment);
    // fileList.forEach((file) => {
    formData.append("file", fileList[0]);
    formData.append("experiment_id", parseInt(selectExperiment['key']))
    // });

    try {
      setUploading(true);
      const response = await UploadService.leads(formData);
      setUploading(false);
      setFileList([]);
      message.success("Leads added successfully");
      navigate(`/app/leads`);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }

    setUploading(false);
  };

  const SubmitButton = () => {
    return (
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{
          marginTop: 16,
        }}
      >
        {uploading ? "Uploading" : "Start Upload"}
      </Button>
    );
  };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      console.log(file);
      const isCsvOrJson =
        file.type === "application/json" || file.type === "text/csv";
      if (!isCsvOrJson) {
        message.error("You can only upload CSV/JSON file!");
        setFileList([]);
      } else {
        setFileList([file]);
      }
      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isLt2M) {
      //   message.error('Image must smaller than 2MB!');
      // }
      // return isJpgOrPng && isLt2M;
      return false;
    },
    fileList,
  };

  const handleOnChange = (value) => {
    setSelectedExperiment(value)
  }

  return (
    <>
      <Card title="Upload Leads" extra={<SubmitButton />} className="h-80">
      <Title level={5}>Project Name</Title>
        <Select onChange={handleOnChange} ref={selectExperiment} labelInValue showSearch placeholder="Select Project" className="mb-3 w-100">
          {experiments.map((experiment) => (
            <Select.Option key={experiment.id} value={experiment.project_label}>
              {experiment.project_label}
            </Select.Option>
          ))}
        </Select>

        <div>
        <Dragger disabled={!selectExperiment} {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single file.
          </p>
        </Dragger>
        </div>
      </Card>
    </>
  );
};
export default UploadLeads;
