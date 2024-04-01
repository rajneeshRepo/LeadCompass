import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  Card,
  Form,
  Modal,
  Descriptions,
  Tag,
  Button,
  Flex,
  Input,
  Space,
  message,
  Select,
  DatePicker,
} from "antd";
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  SearchOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import Filters from "./Filters";
import FileTimeline from "./FileTimeline";
import { useNavigate } from "react-router-dom";
import {
  TABLE_HEIGHT,
  TABLE_WIDTH,
  TABLE_SIZE,
} from "constants/CompanyTableConstant";
import BlobService from "services/BlobService";
import UserService from "services/UserService";
import Highlighter from "react-highlight-words";
import datejs from "datejs";
import {
  getColumnDateRangeProps,
  getColumnSelectProps,
} from "components/util-components/SearchColumnProps";

const { RangePicker } = DatePicker;

// const files = [
//   {
//     id: 1,
//     name: "forecasaa_2023-11-17 07:14:41.522698.json",
//     createdAt: "2023-11-17",
//     status: "Silver",
//     user: "Admin",
//     comment: "Finding leads from california.",
//     filters: {
//       page: 1,
//       page_size: 10,
//       name: "Everest",
//       transaction_tags: ["borrower", "investor"],
//       counties: [
//         "Baldwin-Al",
//         "Madison-Al",
//         "Mobile-Al",
//         "Tuscaloosa-Al",
//         "Jefferson-Al",
//         "Montgomery-Al",
//         "Shelby-Al",
//       ],
//       state: "ALABAMA",
//       amount: {
//         min_value: 232,
//         max_value: 43643,
//       },
//     },
//   },
//   {
//     id: 2,
//     name: "forecasaa_2023-11-17 07:14:41.522698.json",
//     createdAt: "2023-11-17",
//     status: "Silver",
//     user: "Admin",
//     comment: "Finding leads from california.",
//     filters: {
//       page: 1,
//       page_size: 10,
//       name: "Everest",
//       transaction_tags: ["borrower", "investor"],
//       counties: [
//         "Baldwin-Al",
//         "Madison-Al",
//         "Mobile-Al",
//         "Tuscaloosa-Al",
//         "Jefferson-Al",
//         "Montgomery-Al",
//         "Shelby-Al",
//       ],
//       state: "ALABAMA",
//       amount: {
//         min_value: 232,
//         max_value: 43643,
//       },
//     },
//   },
//   {
//     id: 3,
//     name: "forecasaa_2023-11-17 07:14:41.522698.json",
//     createdAt: "2023-11-17",
//     status: "Silver",
//     user: "Admin",
//     comment: "Finding leads from california.",
//     filters: {
//       page: 1,
//       page_size: 10,
//       name: "Everest",
//       transaction_tags: ["borrower", "investor"],
//       counties: [
//         "Baldwin-Al",
//         "Madison-Al",
//         "Mobile-Al",
//         "Tuscaloosa-Al",
//         "Jefferson-Al",
//         "Montgomery-Al",
//         "Shelby-Al",
//       ],
//       state: "ALABAMA",
//       amount: {
//         min_value: 232,
//         max_value: 43643,
//       },
//     },
//   },
//   {
//     id: 4,
//     name: "forecasaa_2023-11-17 07:14:41.522698.json",
//     createdAt: "2023-11-17",
//     status: "Silver",
//     user: "Admin",
//     comment: "Finding leads from california.",
//     filters: {
//       page: 1,
//       page_size: 10,
//       name: "Everest",
//       transaction_tags: ["borrower", "investor"],
//       counties: [
//         "Baldwin-Al",
//         "Madison-Al",
//         "Mobile-Al",
//         "Tuscaloosa-Al",
//         "Jefferson-Al",
//         "Montgomery-Al",
//         "Shelby-Al",
//       ],
//       state: "ALABAMA",
//       amount: {
//         min_value: 232,
//         max_value: 43643,
//       },
//     },
//   },
// ];

const STATUS = [
  {
    label: "Bronze",
    value: "bronze",
  },
  {
    label: "Silver",
    value: "silver",
  },
  {
    label: "Gold",
    value: "gold",
  },
];

const Files = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState([]);
  const [allConfigs, setAllConfigs] = useState([]);
  const [users, setUsers] = useState([]);

  // ******************* Handling Inline Search ***************
  const [filteredInfo, setFilteredInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    // confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = () => {
    // clearFilters();
    // setSearchText("");
    setFilteredInfo({});
    getBlobs({});
  };

  // **************************************

  const [pagination, setTablePagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    getBlobs();
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await UserService.users();
      const users = response.users;
      setUsers(users);
    } catch (error) {
      console.log("Something went wrong");
    }
  };

  const getBlobs = async (data) => {
    try {
      const response = await BlobService.config(data);
      setConfigs(response["configs"]);
      if (allConfigs.length == 0) setAllConfigs(response["configs"]);
    } catch (error) {
      message.error("Couldn't fetch configs");
    }
  };

  const handleFormSubmit = async () => {
    const filters = getFilters();

    try {
      getBlobs(filters);
    } catch (error) {
      console.log(error);
    }
  };

  const getFilters = () => {
    const filters = {
      page: pagination.current,
      page_size: pagination.pageSize,
      ...form.getFieldsValue(),
    };

    const { createdAt, user } = filters;
    delete filters["createdAt"];
    delete filters["user"];

    if (createdAt) {
      const startDate = createdAt[0].format("YYYY-MM-DD");
      const endDate = createdAt[1].format("YYYY-MM-DD");
      filters["createdAt"] = {
        start_date: startDate,
        end_date: endDate,
      };
    }

    if (user) {
      filters["user_id"] = parseInt(user.key, 10);
    }

    return filters;
  };

  const handleTableChange = (pagination, filters) => {
    console.log(filters);
    setFilteredInfo(filters);
    setTablePagination(pagination);
    const { user_name, status, created_at, project_label } = filters;

    const modifiedFilters = {};
    if (user_name && user_name[0]) {
      modifiedFilters["user"] = parseInt(user_name[0], 10);
    }

    if (status && status[0]) {
      modifiedFilters["status"] = status[0];
    }

    if (created_at && created_at[0]) {
      const startDate = created_at[0][0].format("YYYY-MM-DD");
      const endDate = created_at[0][1].format("YYYY-MM-DD");
      modifiedFilters["createdAt"] = {
        start_date: startDate,
        end_date: endDate,
      };
    }

    if (project_label && project_label[0]) {
      modifiedFilters["experiment"] = project_label[0];
    }

    getBlobs(modifiedFilters);
  };

  const showMoreDetails = (event, record) => {
    event.stopPropagation();
    const filters = record.filters;

    const basic_items = [
      {
        key: 1,
        label: "Company Name",
        children: filters.name || "--",
        span: 1,
      },
      {
        key: 2,
        label: "Company Tags",
        children: filters.transaction_tags
          ? filters.transaction_tags.map((tag) => {
              let color = tag.length > 7 ? "geekblue" : "green";
              if (tag === "borrower") {
                color = "volcano";
              }
              return (
                <Tag className="my-1" color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })
          : "--",
        span: 2,
      },
      {
        key: 3,
        label: "Transaction Amount (Min Value)",
        children:
          filters.amount && filters.amount.min_value
            ? `$ ${filters.amount.min_value}`
            : "--",
        span: 2,
      },
      {
        key: 4,
        label: "Transaction Amount (Max Value)",
        children:
          filters.amount && filters.amount.min_value
            ? `$ ${filters.amount.max_value}`
            : "--",
      },
      {
        key: 5,
        label: "State",
        children: filters.state ? filters.state : "--",
      },
      {
        key: 6,
        label: "Counties",
        children: (
          <div className="hide-scrollbar">
            {filters.counties.map((county) => {
              return (
                <Tag className="my-1" key={county}>
                  {county.toUpperCase()}
                </Tag>
              );
            })}
          </div>
        ),
      },
    ];

    Modal.info({
      title: "Applied Filters",
      icon: <></>,
      content: (
        <Descriptions
          labelStyle={{ whiteSpace: "nowrap" }}
          layout="vertical"
          size="small"
          bordered
          items={basic_items}
        />
      ),
      width: "60vw",
    });
  };

  const publishBronzeData = () => {
    navigate(`/app/source`);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => {
      if (dataIndex == "project_label") {
        return (
          <div
            style={{
              padding: 8,
            }}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Input
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                console.log(selectedKeys);
              }}
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              style={{
                marginBottom: 8,
                display: "block",
              }}
            />
          </div>
        );
      } else if (dataIndex == "user_name") {
        return (
          <div
            style={{
              padding: 8,
              width: "200px",
            }}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Select
              className="w-100"
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => {
                console.log(e);
                setSelectedKeys(e ? [e] : []);
                console.log(selectedKeys);
              }}
              onSelect={(e) => {
                console.log(e);
                handleSearch(selectedKeys, confirm, dataIndex);
              }}
              // onPressEnter={() =>
              //   handleSearch(selectedKeys, confirm, dataIndex)
              // }
              style={{
                marginBottom: 8,
                display: "block",
              }}
              labelInValue
              showSearch
            >
              {users.map((user) => (
                <Select.Option key={user.id} value={user.name}>
                  {user.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        );
      }
    },
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    // onFilter: (value, record) =>
    //   record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: "#ffc069",
    //         padding: 0,
    //       }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ""}
    //     />
    //   ) : (
    //     text
    //   ),
  });

  // const getColumnSelectProps = (dataIndex, options, key, label) => ({
  //   filterDropdown: ({
  //     setSelectedKeys,
  //     selectedKeys,
  //     confirm,
  //     clearFilters,
  //     close,
  //   }) => {
  //     return (
  //       <div
  //         style={{
  //           padding: 8,
  //           width: "200px",
  //         }}
  //         onKeyDown={(e) => e.stopPropagation()}
  //       >
  //         <Select
  //           className="w-100"
  //           ref={searchInput}
  //           defaultValue='all'
  //           placeholder={`Search ${dataIndex}`}
  //           value={selectedKeys[0]}
  //           onSelect={(e) => {
  //             setSelectedKeys(e != 'all' ? [e] : []);
  //             handleSearch(selectedKeys, confirm, dataIndex);
  //           }}
  //           style={{
  //             marginBottom: 8,
  //             display: "block",
  //           }}
  //           labelInValue
  //           showSearch
  //         >
  //           <Select.Option key='all' value='all'>
  //               All
  //             </Select.Option>
  //           {options.map((option) => (
  //             <Select.Option key={option[key]} value={option[label]}>
  //               {option[label]}
  //             </Select.Option>
  //           ))}
  //         </Select>
  //       </div>
  //     );
  //   },
  //   filterIcon: (filtered) => (
  //     <SearchOutlined
  //       style={{
  //         color: filtered ? "#1677ff" : undefined,
  //       }}
  //     />
  //   ),
  //   onFilterDropdownOpenChange: (visible) => {
  //     if (visible) {
  //       setTimeout(() => searchInput.current?.select(), 100);
  //     }
  //   },
  // });

  // const getColumnDateRangeProps = (dataIndex) => ({
  //   filterDropdown: ({
  //     setSelectedKeys,
  //     selectedKeys,
  //     confirm,
  //     clearFilters,
  //     close,
  //   }) => {
  //     return (
  //       <div
  //         style={{
  //           padding: 8,
  //           width: "230px",
  //         }}
  //         onKeyDown={(e) => e.stopPropagation()}
  //       >
  //         <RangePicker
  //           className="w-100"
  //           // ref={searchInput}
  //           placeholder={["Start Date", "End Date"]}
  //           value={selectedKeys[0]}
  //           format={"YYYY/MM/DD"}
  //           onChange={(e) => {
  //             setSelectedKeys(e ? [e] : []);
  //             handleSearch(selectedKeys, confirm, dataIndex);
  //           }}
  //           style={
  //             {
  //               // marginBottom: 8,
  //               // display: "block",
  //             }
  //           }
  //         />
  //       </div>
  //     );
  //   },
  //   filterIcon: (filtered) => (
  //     <CalendarOutlined
  //       style={{
  //         color: filtered ? "#1677ff" : undefined,
  //       }}
  //     />
  //   ),
  //   onFilterDropdownOpenChange: (visible) => {
  //     if (visible) {
  //       setTimeout(() => searchInput.current?.select(), 100);
  //     }
  //   },
  // });

  const columns = [
    // {
    //   title: "Name",
    //   dataIndex: "file_name",
    //   key: "file_name",
    //   ...getColumnSearchProps('name'),
    // },
    {
      title: "Experiment Name",
      dataIndex: "project_label",
      key: "project_label",
      ...getColumnSelectProps({
        key: "project_label",
        placeholder: "select project",
        filteredInfo,
        dropdownProp: {
          options: allConfigs,
          optionKey: "id",
          optionLabel: "project_label",
        },
      }),
    },
    {
      title: "Created by",
      dataIndex: "user_name",
      key: "user_name",
      ...getColumnSelectProps({
        key: "user_name",
        placeholder: "select user",
        filteredInfo,
        dropdownProp: { options: users, optionKey: "id", optionLabel: "name" },
      }),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      ...getColumnSelectProps({
        key: "status",
        placeholder: "select status",
        filteredInfo,
        dropdownProp: {
          options: STATUS,
          optionKey: "value",
          optionLabel: "label",
        },
      }),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      ...getColumnDateRangeProps({ key: "created_at", filteredInfo }),
      render: (text) => formatDate(text),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.meta_data.bronze.filters && (
          <a
            onClick={(event) => showMoreDetails(event, record.meta_data.bronze)}
          >
            More Details
          </a>
        ),
    },
  ];

  const formatDate = (date) => {
    const dateObject = Date.parse(date);
    const formattedDate = dateObject.toString("dd MMM yyyy (h:mm tt)");
    // console.log(formattedDate);
    return formattedDate;
  };

  return (
    <>
      <Card>
        <Form
          // initialValues={{"last_transaction_date": [dayjs('2023-11-01', dateFormat), dayjs('2023-12-29', dateFormat)]}}
          onFinish={handleFormSubmit}
          size="middle"
          name="file_search"
          form={form}
          layout="vertical"
          disabled={loading}
        >
          {/* <Filters /> */}
          <Flex justify="right">
            <Button
              className="m-2"
              onClick={handleReset}
              icon={<MinusCircleOutlined />}
            >
              Reset Filters
            </Button>
            <Button
              className="m-2"
              onClick={publishBronzeData}
              type="primary"
              icon={<PlusCircleOutlined />}
            >
              Start New Experiment
            </Button>
          </Flex>
          <Table
            size={TABLE_SIZE}
            pagination={pagination}
            rowClassName={() => "cursor-pointer"}
            className="no-border-last"
            rowKey="id"
            columns={columns}
            loading={loading}
            dataSource={configs}
            expandable={{
              expandedRowRender: (record) => (
                <div className="pt-1 pb-2">
                  <FileTimeline metadata={record.meta_data} />
                </div>
              ),
              expandRowByClick: true,
              expandIcon: () => <></>,
              expandIconColumnIndex: -1,
            }}
            scroll={{ x: TABLE_WIDTH, y: TABLE_HEIGHT }}
            onChange={handleTableChange}
          />
        </Form>
      </Card>
    </>
  );
};
export default Files;
