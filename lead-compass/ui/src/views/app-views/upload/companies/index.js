import React, { useState, useEffect } from "react";
import {
  Table,
  Form,
  Card,
  Button,
  Flex,
  Upload,
  Modal,
  Input,
  Tag,
  Typography,
  message,
} from "antd";
import {
  UploadOutlined,
  InboxOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import Papa from "papaparse";
import * as XLSX from "xlsx";

// Import services
import CompanyService from "services/CompanyService";
import UploadService from "services/UploadService";

// Import constant dropdown options
import {
  STATES,
  TAGS,
} from "components/util-components/CompanyFilters/CompanyFiltersData";

// Import table constant props
import {
  TABLE_HEIGHT,
  TABLE_WIDTH,
  TABLE_SIZE,
} from "constants/CompanyTableConstant";

// Import custom inline table filters/search
import {
  getColumnSearchProps,
  getColumnSelectProps,
  getRangeProps,
} from "components/util-components/SearchColumnProps";

// Import sample file to download
import SampleFile from "assets/files/borrowers.xlsx";

const { Dragger } = Upload;
const { TextArea } = Input;
const { Paragraph } = Typography;

const JSON_FILE_TYPE = "application/json";
const CSV_FILE_TYPE = "text/csv";
const XLSX_FILE_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const REQUIRED_FIELDS = [
  "Company Name",
  "Address",
  "Company Tags",
  "Average Mortgage Amount",
];
const ALLOWED_FILE_TYPES = [JSON_FILE_TYPE, CSV_FILE_TYPE, XLSX_FILE_TYPE];
const ALLOWED_FILE_SIZE = 10; // In MB

const UploadFile = ({ closeModal }) => {
  const [projectName, setProjectName] = useState("");
  const [fileList, setFileList] = useState([]);
  const [validRows, setValidRows] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", fileList[0]);

    try {
      setIsAdding(true);
      // TODO:
      // Add new project using file as data source
      const response = await UploadService.companies({
        companies: validRows,
        project_label: projectName,
      });

      setFileList([]);
      setValidRows([]);
      setIsAdding(false);
      message.success("New project created successfully");
    } catch (error) {
      setIsAdding(false);
      message.error("Couldn't create new project");
    }

    closeModal();
  };

  const SubmitButton = () => {
    return (
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={
          !projectName.trim() ||
          fileList.length == 0 ||
          fileList[0].status == "uploading"
        }
        loading={isAdding}
        className="mt-2"
      >
        Create
      </Button>
    );
  };

  const isValidJSON = () => {};

  const extractValidAndInvalidRowsFromCSV = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          console.log("CSV OBJ", results);
          const missingRequiredFields = REQUIRED_FIELDS.filter(
            (field) => !results.meta.fields.includes(field)
          );
          if (missingRequiredFields.length != 0)
            reject({ missingRequiredFields });

          const validRows = [],
            inValidRows = [];
          results.data.forEach((row) => {
            const containsAllRequiredFieldsValue = REQUIRED_FIELDS.every(
              (field) => row[field].trim()
            );

            console.log(
              "Has All Required Fields: ",
              containsAllRequiredFieldsValue
            );
            const hasValidCompanyTags = row["Company Tags"]
              .split(",")
              .every((tag) => {
                tag = tag.trim();
                tag = tag.replace(" ", "_");
                return TAGS.some((tagObj) => tagObj.value == tag);
              });

            console.log("Has Valid Company Tags: ", hasValidCompanyTags);

            const hasValidAvgMrtAmount = !isNaN(row["Average Mortgage Amount"]);
            if (hasValidAvgMrtAmount) {
              row["Average Mortgage Amount"] = parseInt(
                row["Average Mortgage Amount"],
                10
              );
            }

            if (
              containsAllRequiredFieldsValue &&
              hasValidCompanyTags &&
              hasValidAvgMrtAmount
            )
              validRows.push(row);
            else inValidRows.push(row);
          });

          if (validRows.length == 0)
            reject({ noValidRows: "No valid rows present." });
          resolve({ validRows, inValidRows });
        },
      });
    });
  };

  const extractValidAndInvalidRowsFromXLSX = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonDataArray = XLSX.utils.sheet_to_json(worksheet);

        if (jsonDataArray.length == 0)
          return reject({ noRows: "No rows present." });

        console.log("XLSX JSON", jsonDataArray);

        // Temp Code Will Be Refactored
        const missingRequiredFields = REQUIRED_FIELDS.filter(
          (field) => !(field in jsonDataArray[0])
        );

        if (missingRequiredFields.length != 0)
          reject({ missingRequiredFields });

        const validRows = [];
        const inValidRows = [];
        jsonDataArray.forEach((row) => {
          const containsAllRequiredFieldsValue = REQUIRED_FIELDS.every(
            (field) => {
              return field != "Average Mortgage Amount"
                ? row[field].trim()
                : !isNaN(row[field]);
            }
          );

          console.log(
            "Has All Required Fields: ",
            containsAllRequiredFieldsValue
          );
          const hasValidCompanyTags = row["Company Tags"]
            .split(",")
            .every((tag) => {
              tag = tag.trim();
              tag = tag.replace(" ", "_");
              return TAGS.some((tagObj) => tagObj.value == tag);
            });

          console.log("Has Valid Company Tags: ", hasValidCompanyTags);
          if (containsAllRequiredFieldsValue && hasValidCompanyTags)
            validRows.push(row);
          else inValidRows.push(row);
        });

        if (validRows.length == 0)
          reject({ noValidRows: "No valid rows present." });

        resolve({ validRows, inValidRows });
      };

      reader.readAsBinaryString(file);
    });
  };

  const validateFile = (file) => {
    // File type check
    const isCsvJsonOrXlsx = ALLOWED_FILE_TYPES.includes(file.type);
    if (!isCsvJsonOrXlsx) {
      message.error("You can only upload CSV, JSON or XLSX file!");
      return false;
    }

    // File size check
    const isLtAllowedM = file.size / 1024 / 1024 <= ALLOWED_FILE_SIZE;
    if (!isLtAllowedM) {
      message.error(`File must smaller than ${ALLOWED_FILE_SIZE}MB!`);
      return false;
    }

    return true;
  };

  const extractValidAndInvalidRows = async (file) => {
    if (file.type == CSV_FILE_TYPE) {
      return await extractValidAndInvalidRowsFromCSV(file);
    } else if (file.type == XLSX_FILE_TYPE) {
      return await extractValidAndInvalidRowsFromXLSX(file);
    } else if (file.type == JSON_FILE_TYPE) {
    }
  };

  const donloadInValidRows = (fileType, inValidRows) => {
    if (fileType == CSV_FILE_TYPE) {
      // Convert JSON to CSV using PapaParse
      const csvData = Papa.unparse(inValidRows);

      // Create a Blob and a download link
      const blob = new Blob([csvData], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "invalidData.csv";

      // Append the link to the body and trigger the download
      document.body.appendChild(link);
      link.click();

      // Remove the link from the body
      document.body.removeChild(link);
    } else if (fileType == XLSX_FILE_TYPE) {
      const worksheet = XLSX.utils.json_to_sheet(inValidRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
      const fileBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "buffer",
      });
      const blob = new Blob([fileBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "invalidData.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: async (file) => {
      console.log("UPLOADED FILE: ", file);
      const isValidFile = validateFile(file);
      if (!isValidFile) return false;

      try {
        file.status = "uploading";
        setFileList([file]);

        const { validRows, inValidRows } = await extractValidAndInvalidRows(
          file
        );
        console.log("Valid Rows", validRows);
        console.log("Invalid Rows", inValidRows);

        setValidRows(validRows);
        if (inValidRows != 0) donloadInValidRows(file.type, inValidRows);

        file.status = "success";
        setFileList([file]);
      } catch (error) {
        console.log("BEFORE UPLOAD ERROR: ", error);

        if (error.missingRequiredFields)
          message.error(error.missingRequiredFields + " fields required");
        if (error.noValidRows) message.error(error.noValidRows);
        if (error.noRows) message.error(error.noRows);
        setFileList([]);
      }

      return false;
    },
    fileList,
  };

  const handleOnChange = (event) => {
    setProjectName(event.target.value);
  };

  return (
    <>
      <Flex justify="end">
        <a href={SampleFile} download="borrowers_sample.xlsx" target="_blank">
          <Button className="mb-2">Export Sample File</Button>
        </a>
      </Flex>

      <Paragraph>
        <ul>
          <li>
            File size should be less than <strong>10MB</strong>.
          </li>
          <li>
            Allowed formats: <strong>JSON</strong>, <strong>CSV</strong>, and
            <strong> XLSX</strong>.
          </li>
          <li>
            Required fields: <strong>Company Name</strong>,{" "}
            <strong>Address</strong>, <strong>Company Tags</strong>,{" "}
            <strong>Average Mortgage Amount</strong>
          </li>
          <li>
            Invalid data will be downloaded as <strong>invalidData</strong>.
          </li>
        </ul>
      </Paragraph>

      <Dragger style={{ height: "30vh" }} {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">File should be in required format.</p>
      </Dragger>
      <TextArea
        className="my-3"
        onChange={handleOnChange}
        showCount
        maxLength={100}
        placeholder="Enter project name"
      />

      <Flex justify="end">
        <SubmitButton />
      </Flex>
    </>
  );
};

const UPLOAD_MODAL = "upload-modal";
const PROJECT_NAME_MODAL = "project-name-modal";

export const UploadCompanies = () => {
  const [form] = Form.useForm(null);

  // Adding action state
  const [isAdding, setIsAdding] = useState(false);

  // Modal state
  const [isCommentModalOpen, setIsProjectNameModalOpen] = useState(false);
  const [isUploadFileModalOpen, setIsUploadFileModalOpen] = useState(false);

  // Filters state
  const [isFiltersApplied, setIsFiltersApplied] = useState(false);
  const [filteredInfo, setFilteredInfo] = useState({});

  // Table state
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setTablePagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    getCompanies();
  }, [filteredInfo, pagination.current, pagination.pageSize]);

  const getCompanies = async () => {
    // Currently applied filters
    const filters = getFilters();

    setLoading(true);
    try {
      const response = await CompanyService.companies(filters);
      if (response.companies) setCompanies(response.companies);

      // setting pagination

      setTablePagination({
        ...pagination,
        total: response.companies_total_count,
      });
    } catch (error) {
      message.error("Something Went Wrong");
    }

    setLoading(false);
  };

  const addProject = () => {
    form
      .validateFields()
      .then(async (fields) => {
        // Get currently applied filters
        const filters = getFilters();
        try {
          setIsAdding(true);

          const response = await UploadService.companies({
            filters,
            project_label: fields.project_name,
          });

          // Close modal and show sccess message
          setIsAdding(false);
          message.success(`Companies added successfully`);
        } catch (error) {
          // Close modal and show error message
          setIsAdding(false);
          message.error(`Something wents wrong`);
        }

        // At last close modal in case (Success or Error)
        handleCancelModal();
      })
      .catch((error) => console.log(error));
  };

  const handleTableChange = (pagination, filters) => {
    setTablePagination(pagination);
    setFilteredInfo(filters);

    // Setting if filter applied or not
    const isFiltersApplied =
      filters.address || filters.tag_names || filters.amount || filters.name;
    setIsFiltersApplied(isFiltersApplied);
  };

  const getFilters = () => {
    // Iniitalizing filter with pagination props.
    const filters = {
      page: pagination.current,
      page_size: pagination.pageSize,
    };

    // Destructuring filtered info
    let { address, tag_names, name, amount } = filteredInfo;

    // Adding state + counties filter
    if (address && address[0]) {
      filters["state"] = address[0];
      filters["counties"] = getCountiesFromState(address[0]);
    }

    // Adding tag_name filter
    if (tag_names) {
      filters["transaction_tags"] = tag_names;
    }

    // Adding name filter
    if (name && name[0]) filters["name"] = name[0];

    // Adding amount filter
    if (amount && amount[0]) {
      amount = amount[0];

      if (amount["min_value"] && amount["max_value"]) {
        filters["amount"] = amount;
      } else if (amount["min_value"]) {
        filters["amount"] = { min_value: amount["min_value"] };
      } else if (amount["max_value"]) {
        filters["amount"] = { max_value: amount["max_value"] };
      }
    }

    console.log("Current Filters: ", filters);
    return filters;
  };

  const getCountiesFromState = (state) => {
    console.log("STATE: ", state);
    const stateObject = STATES.find((stateObj) => stateObj.value === state);
    const counties = stateObject.children.map((countyObj) => countyObj.value);
    console.log("Counties: ", counties);
    return counties;
  };

  const resetFilters = () => {
    setIsFiltersApplied(false);
    setFilteredInfo({});
  };

  const openModal = (modal) => {
    if (modal == UPLOAD_MODAL) {
      setIsUploadFileModalOpen(true);
    } else if (modal == PROJECT_NAME_MODAL) {
      setIsProjectNameModalOpen(true);
    }
  };

  const handleCancelModal = () => {
    // Closing All Modal
    setIsProjectNameModalOpen(false);
    setIsUploadFileModalOpen(false);

    // Resetting Form
    form.resetFields();
  };

  const columns = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
      render: (text) => <a>{text.toUpperCase()}</a>,
      ...getColumnSearchProps({
        key: "name",
        placeholder: "search name",
        filteredInfo,
      }),
    },
    {
      title: "Address",
      key: "address",
      dataIndex: "principal_address",
      render: (address) => {
        return address == null ? <span> -- </span> : <span>{address}</span>;
      },
      ...getColumnSelectProps({
        key: "address",
        placeholder: "select state",
        filteredInfo,
        dropdownProp: {
          options: STATES,
          optionKey: "value",
          optionLabel: "label",
        },
      }),
    },
    {
      title: "Tags",
      key: "tag_names",
      width: "35%",
      dataIndex: "tag_names",
      ...getColumnSelectProps({
        key: "tag_names",
        placeholder: "select tags",
        mode: "multiple",
        filteredInfo,
        dropdownProp: {
          options: TAGS,
          optionKey: "value",
          optionLabel: "label",
        },
      }),
      render: (tag_names) => (
        <div className="p-2">
          {tag_names.map((tag) => {
            let color = tag.length > 7 ? "geekblue" : "green";
            if (tag === "borrower") {
              color = "volcano";
            }
            return (
              <Tag className="my-1" color={color} key={tag}>
                {tag.toUpperCase().replaceAll("_", " ")}
              </Tag>
            );
          })}
        </div>
      ),
    },
    {
      title: "Average Mortgage Amount",
      key: "amount",
      dataIndex: "average_mortgage_amount",
      ...getRangeProps({ key: "amount", filteredInfo }),
      render: (amount) => (amount == null ? `$ ${0}` : `$ ${amount}`),
      fixed: "right",
    },
  ];

  return (
    <>
      <Card>
        <Flex className="m-2" gap="middle" justify="end" align="center">
          <Button icon={<MinusCircleOutlined />} onClick={resetFilters}>
            Reset Filters
          </Button>

          <Button
            disabled={!isFiltersApplied || companies.length == 0}
            onClick={() => openModal(PROJECT_NAME_MODAL)}
            type="primary"
          >
            Publish
          </Button>

          <Button
            onClick={() => openModal(UPLOAD_MODAL)}
            type="primary"
            icon={<UploadOutlined />}
          >
            Import File
          </Button>
        </Flex>

        <Table
          size={TABLE_SIZE}
          pagination={pagination}
          className="no-border-last"
          rowKey="id"
          columns={columns}
          loading={loading}
          dataSource={companies}
          scroll={{ x: TABLE_WIDTH, y: TABLE_HEIGHT }}
          onChange={handleTableChange}
        />
      </Card>

      {/* Enter project name while publishing */}
      <Modal
        okText="submit"
        width="40vw"
        title={`Enter Project Name`}
        open={isCommentModalOpen}
        onOk={addProject}
        onCancel={handleCancelModal}
        confirmLoading={isAdding}
      >
        <Form form={form}>
          <Form.Item
            name="project_name"
            rules={[{ required: true, message: "Provide project name" }]}
          >
            <TextArea
              showCount
              maxLength={100}
              placeholder="Enter project name"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Upload file modal */}
      <Modal
        width="45vw"
        title="Upload File"
        footer={[]}
        onCancel={handleCancelModal}
        open={isUploadFileModalOpen}
      >
        <UploadFile closeModal={handleCancelModal} />
      </Modal>
    </>
  );
};

export default UploadCompanies;
