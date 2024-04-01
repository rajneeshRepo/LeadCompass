import React, { useState, useEffect } from "react";
import {
  Card,
  Flex,
  Button,
  Form,
  Table,
  Select,
  Row,
  Col,
  message,
  Dropdown,
  Modal,
  Slider,
  InputNumber,
  Input
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  MoreOutlined,
  StarOutlined,
  StarFilled,
  SearchOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import OrganizationService from "services/OrganizationService";
import { SPACER } from "constants/ThemeConstant";

// const TABLE_SIZE = 10

// const PROJECTS = [
//   {
//     name: "Shorthills AI",
//     organization_id: "77",
//     annual_revenue: "$1M",
//     decision_makers: "Ujjwal",
//   },
//   {
//     name: "Shorthills AI",
//     organization_id: "77",
//     annual_revenue: "$1M",
//     decision_makers: "Ujjwal2",
//   },
//   {
//     name: "Shorthills AII",
//     organization_id: "77",
//     annual_revenue: "$1M",
//     decision_makers: "Ujjwal3",
//   },
// ];

const CardDropdown = ({ items }) => {
  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <a
        href="/#"
        className="text-gray font-size-lg"
        onClick={(e) => e.preventDefault()}
      >
        <MoreOutlined />
      </a>
    </Dropdown>
  );
};

const { Option } = Select;

const OrganizationsList = ({onSearch}) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [minAnnualRevenue, setMinAnnualRevenue] = useState([10, 200]);
  const [maxAnnualRevenue, setMaxAnnualRevenue] = useState([10, 200]);
  const [organizations, setOrganizations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const handleInputChange = (value) => {
    setSearchQuery(value);
  };

  const handleSearch = () => {
    console.log(searchQuery);
    setSearchQuery(searchQuery);
  };

  const [value, setValue] = useState(0);

  const handleStarClick = (val) => {
    setValue(val);
  };

  useEffect(() => {
    getLeadContacts();
  }, []);

  useEffect(() => {
    async function fetchOrganizations() {
      try {
        // Only proceed if searchQuery is not an empty string
        if (searchQuery.trim() !== "") {
          // setLoading(true);
          // console.log("debugkelmd")
          const response = await OrganizationService.searchOrganizations({ type: "organization", search_query: searchQuery });
          console.log("dub");
          console.log(response);
          
          if (response.result === undefined || response.result.length === 0) {
            console.log("No Organizations found")
            setContacts([]); 
          } else {
            const formattedContacts = response.result.map((contact) => ({
              name: contact.name,
              organization_id: contact.id,
              annual_revenue: contact.annual_revenue,
              decision_makers: contact.last_modified,
            }));
            setContacts(formattedContacts);
          }
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
      } finally {
        // setLoading(false);
      }
    }
  
    fetchOrganizations();
  }, [searchQuery]);
  

  const getLeadContacts = async () => {
    try {
      const response = await OrganizationService.getOrganizations({});

      const formattedContacts = response.result.map((contact) => ({
        name: contact.name,
        organization_id: contact.id,
        annual_revenue: contact.annual_revenue,
        decision_makers: contact.last_modified,
      }));

      setContacts(formattedContacts);
    } catch (error) {
      message.error(`Couldn't get Organizations.`);
    }
  };

  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.search);
  const queryParams = new URLSearchParams(location.search);
  console.log(queryParams);

  const handleFormSubmit = (values) => {
    console.log(values);
  };

  const columns = [
    {
      title: "Organization Name",
      key: "name",
      dataIndex: "name",
      width: "25%",
    },
    {
      title: "Organization Id",
      key: "organization_id",
      dataIndex: "organization_id",
      width: "20%",
    },
    {
      title: "Annual Revenue",
      key: "annual_revenue",
      dataIndex: "annual_revenue",
      width: "20%",
    },
    {
      title: "Decision Makers",
      key: "decision_makers",
      dataIndex: "decision_makers",
      width: "20%",
    },
    {
      title: "",
      key: "actions",
      render: () => (
        <Button type="link" icon={<EditOutlined />} onClick={handleEditClick}>
          Edit
        </Button>
      ),
    },
  ];

  const handleEditClick = (record) => {
    return {
      onClick: () => navigate(`/app/organizations/${record.name}`),
    };
  };

  // const addContactOptions = [
  //   {
  //     key: "Add",
  //     label: (
  //       <Flex alignItems="center" gap={SPACER[2]}>
  //         <PlusOutlined />
  //         <span className="ml-2">Add</span>
  //       </Flex>
  //     ),
  //     onClick: () => openContactFormModal(),
  //   },
  // ];

  const openContactFormModal = (contact) => {
    setIsModalOpen(true);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // const FilterModal = ({ visible, onCancel, onApply }) => {
  //   // State variables to store filter values
  //   const [state, setState] = useState("");
  //   const [city, setCity] = useState("");
  //   const [annualRevenueMin, setAnnualRevenueMin] = useState(10);
  //   const [annualRevenueMax, setAnnualRevenueMax] = useState(200);

  //   // Function to handle applying filters
  //   const handleApplyFilters = () => {
  //     const filters = {
  //       state,
  //       city,
  //       annualRevenueMin,
  //       annualRevenueMax,
  //     };
  //     // Pass filters to parent component
  //     onApply(filters);
  //   };

  return (
    <Card style={{ height: "90%" }} bodyStyle={{ height: "100%" }}>
      {queryParams["size"] == 1 ? (
        <Flex className="h-100 mt-5" justify="center" align="space-around">
          <Flex vertical align="center">
            <h2>Organizations</h2>
            {/* <img src={NoProjectsImage}></img> */}

            <Button
              onClick={() => {
                navigate("/app/organizations/create");
              }}
              type="primary"
              icon={<PlusOutlined />}
            >
              Add Organization
            </Button>
          </Flex>
        </Flex>
      ) : (
        <>
          <Flex justify="space-between">
            <h2>Organizations</h2>
            <Button
              onClick={() => navigate("/app/organizations/create")}
              type="primary"
              icon={<PlusOutlined />}
            >
              Add Organization
            </Button>
          </Flex>

          {/* Add Organization search bar here */}
          <Row className="mt-3">
          <Col span={6}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search Organizations"
              allowClear
              value={searchQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              onPressEnter={handleSearch} // Trigger search on Enter key press
              // onBlur={handleSearch} // Trigger search on blur (when user clicks away)
            />
          </Col>
            {/* <Col span={6}>
              <Form onFinish={handleFormSubmit}>
                <Form.Item name="organization">
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Search Organizations"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    // loading={loading}
                  >
                    {contacts.map((org) => (
                      <Option key={org.id} value={org.id}>
                        {org.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
            </Col> */}

            <Col span={1}>
              <span>OR</span>
            </Col>

            <Col span={6}>
              <Form onFinish={handleFormSubmit}>
                <Form.Item name="decisionMaker">
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Search Decision Makers"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="1">Ujjwal</Option>
                    <Option value="2">Rahul</Option>
                    <Option value="3">Saurabh</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Col>

            <Col span={1} offset={10} onClick={openContactFormModal}>
              <MoreOutlined style={{ fontSize: "24px" }} />
            </Col>
            {/* <Card
              extra={<CardDropdown items={addContactOptions}  />}
              onClick={openContactFormModal}
            ></Card> */}

            {/* </Col> */}
          </Row>

          <Table
            onRow={handleEditClick}
            // size={TABLE_SIZE}
            // pagination={pagination}
            className="no-border-last"
            rowKey="name"
            columns={columns}
            // loading={loading}
            dataSource={contacts}
            // scroll={{ x: TABLE_WIDTH, y: TABLE_HEIGHT }}
            // onChange={handleTableChange}
          />
          <Modal
            okText="submit"
            width="30vw"
            title={`Filters`}
            open={isModalOpen}
            // onOk={handleContactSubmit}
            onCancel={handleCancelModal}
            footer={[
              <Button key="reset">Reset</Button>,
              <Button key="apply" type="primary" onClick={console.log("a")}>
                Apply
              </Button>,
            ]}
          >
            {/* <hr/> */}
            <br />
            <div>
              <p>State</p>
              <Select
                style={{ width: "100%" }}
                onChange={(value) => setState(value)}
              >
                <Option value="California">California</Option>
                <Option value="Texas">Texas</Option>
                <Option value="Florida">Florida</Option>
                <Option value="New York">New York</Option>
              </Select>
            </div>
            <div>
              <p>City</p>
              <Select
                style={{ width: "100%" }}
                onChange={(value) => setCity(value)}
              >
                <Option value="Minneapolis">Minneapolis</Option>
                <Option value="Pittsburgh">Pittsburgh</Option>
                <Option value="Miami">Miami</Option>
                <Option value="Austin">Austin</Option>
              </Select>
            </div>

            <p>Annual Revenue range(in million)</p>
            <div>
              <InputNumber
                min={0}
                max={200}
                defaultValue={10}
                onChange={(minAnnualRevenue) =>
                  setMinAnnualRevenue(minAnnualRevenue)
                }
              />
              <InputNumber
                min={0}
                max={200}
                defaultValue={200}
                onChange={(maxAnnualRevenue) =>
                  setMaxAnnualRevenue(maxAnnualRevenue)
                }
              />
            </div>
            {/* <Slider
                range={{
                  draggableTrack: true,
                }}
                defaultValue={[10, 200]}
                value={minAnnualRevenue}
                onChange={(value) => setMinAnnualRevenue(value)}
              /> */}
            <br />
            <div style={{ width: "100%" }}>
              <p>Growth Scale</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    style={{
                      cursor: "pointer",
                      fontSize: "24px",
                      marginRight: "5px",
                    }}
                    onClick={() => handleStarClick(index + 1)}
                  >
                    {index < value ? (
                      <StarFilled style={{ color: "#ffc107" }} />
                    ) : (
                      <StarOutlined />
                    )}
                  </span>
                ))}
              </div>
            </div>
          </Modal>
        </>
      )}
    </Card>
  );
};

export default OrganizationsList;
