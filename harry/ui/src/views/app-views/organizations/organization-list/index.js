import React, { useState, useEffect } from "react";
import {Button,Row,Col,Card,Input, Modal,Select,Table} from "antd";
import { EditOutlined,SearchOutlined, MoreOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import ApiService from "services/ApiService";
import { useNavigate, useLocation } from "react-router-dom";
import usa_state from "../../../../assets/data/usa_state.json";
import { use } from "i18next";
import { set } from "lodash";
const states = Object.keys(usa_state);
const {Option} = Select;

const OrganizationsList = ({user_data}) => {
const navigate = useNavigate();
const { user } = useSelector((state) => state.auth);
const [organizations, setOrganizations] = useState([]);
const [searchOrganizationQuery, setSearchOrganizationQuery] = useState({"organization_name":"","person_name":""});
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedState, setSelectedState] = useState(null);
const [selectedCity, setSelectedCity] = useState("");
const [cities,setCities] = useState([]);
const [annualRevenueRange, setAnnualRevenueRange] = useState(null);
const [teamSizeRange, setTeamSizeRange] = useState(null);
const [growthFromLastYear,setGrowthFromLastYear] = useState(null);
const [currentPage,setCurrentPage] = useState(1);
const [pageSize,setPageSize] = useState(1);
const [loading,setLoading] = useState(false);
const [totalCount,setTotalCount] = useState(0);


const revenueRanges = [
  { value: '0-1M', label: '$0 - $1M' },
  { value: '1M-5M', label: '$1M - $5M' },
  { value: '5M-10M', label: '$5M - $10M' },
  { value: '10M-50M', label: '$10M - $50M' },
  { value: '50M-100M', label: '$50M- $100M' },
  { value: '100M+', label: '$100M+' },
];

const teamSizeRanges = [
  { value: '0-10', label: '0 - 10' },
  { value: '11-50', label: '11 - 50' },
  { value: '51-100', label: '51 - 100' },
];

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
      dataIndex: "id",
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
      dataIndex: "total_decision_makers",
      width: "20%",
    },
    {
      title: "",
      key: "actions",
      dataIndex:'organization_id',
      render: (record) => (
        <Button type="link" icon={<EditOutlined />} onClick={handleEditClick(record)}>
          Edit
        </Button>
      ),
    },
  ];

useEffect(() => {
  fetchOrganizations(currentPage);
}, []);

const fetchOrganizations = async (page) => {
  setLoading(true);
  let user_email = "";
  let query = {}
  let filters = {
    filter_state: selectedState,
    filter_city: selectedCity,
    annual_revenue: annualRevenueRange,
    team_size: teamSizeRange,
    growth_from_last_year: growthFromLastYear
  }
  query = {
    ...query,
    ...searchOrganizationQuery,
    ...filters
  }
  query['page'] = page;
  query['page_size'] = pageSize;
  if (user.role === "user") {
    user_email = user.email; 
  }
  else if (user.role === "admin" && user_data.email !== undefined) {
    user_email = user_data.email;
  }
  query['user_email'] = user_email;


  try {
    const response = await ApiService.harryBackendApi("/organization/all","get",query,null);
    console.log(response);
    setOrganizations(response.result);
    setTotalCount(response.total);
  }
  catch (error) {
    console.error("Error fetching organizations:", error);

  }
  finally {
    setLoading(false);
  }

}

  const handleEditClick = (record) => {
    return {
      onClick: () => navigate(`/app/organizations/${record.organization_id}`),
    };
  };

const handleInputChange = (value,name) => {
    if(name === "organization_name"){
      if (searchOrganizationQuery["person_name"] !== "") {
        setSearchOrganizationQuery({"person_name":null})
      }
    setSearchOrganizationQuery({"organization_name":value});
  }else if(name === "person_name"){
    if (searchOrganizationQuery["organization_name"] !== "") {
    setSearchOrganizationQuery({"organization_name":null});}

    setSearchOrganizationQuery({"person_name":value});
  }
  }

  const handleSearch = () => { 
    fetchOrganizations();
  }

const handleStateChange = async (value) => {
await setSelectedState(value);
await setSelectedCity(usa_state[value]);
}


const handleCityChange = async (value) => {
  setSelectedCity(value);
}

const handleCancelModal = () => {
  setIsModalOpen(false);
}
const openContactFormModal = () => {
  setIsModalOpen(true);
}

const handleApply =  () => {
  console.log(selectedState,selectedCity,annualRevenueRange,teamSizeRange);
  setIsModalOpen(false);
  fetchOrganizations(currentPage);
}

const handleReset = () => {
  setSelectedState(null);
  setSelectedCity("");
  setAnnualRevenueRange(null);
  setTeamSizeRange(null);
  setGrowthFromLastYear(null);
  setIsModalOpen(false);
  fetchOrganizations(currentPage);
}

const handleTableChange = (pagination) => {
  setCurrentPage(pagination);
  fetchOrganizations(pagination);
}
  
  return (
    <Card style={{ height: "90%" }}>
      <h1>Organizations List</h1>
      <Row className="mt-3">
        <Col span={6}>
          <Input
             prefix={<SearchOutlined />}
               placeholder="Search Organizations"
               allowClear
               value={searchOrganizationQuery.organization_name}
               onChange={(e) => handleInputChange(e.target.value,"organization_name")}
               onPressEnter={handleSearch}
             />
           </Col>
           <Col span={1} style={{"textAlign":"center","marginTop":"6px"}}>
              <span>OR</span>
            </Col>
            <Col span={6}>
             <Input
               prefix={<SearchOutlined />}
               placeholder="Search Desicion Makers"
               allowClear
               value={searchOrganizationQuery.person_name}
               onChange={(e) => handleInputChange(e.target.value,"person_name")}
               onPressEnter={handleSearch}
             />
           </Col>
           <Col span={1} offset={10} onClick={openContactFormModal}>
            <MoreOutlined style={{ fontSize: "24px" }} />
            </Col>
      </Row>
          <Table
          pagination={{
            pageSize: pageSize,
            total: totalCount,
            current: currentPage,
            onChange: handleTableChange,
          }}
          className="no-border-last mt-3"
          rowKey="name"
          columns={columns}
          loading={loading}

          dataSource={organizations}
          />

      <Modal
             okText="submit"
             width="30vw"
             title={`Filters`}
             open={isModalOpen}
             // onOk={handleContactSubmit}
             onCancel={handleCancelModal}
             footer={[
               <Button key="reset" onClick={handleReset}>Reset</Button>,
               <Button key="apply" type="primary" onClick={handleApply}>
                 Apply
               </Button>,
             ]}
           >
             <br />
             <div>
               <span>State</span>
               <Select
                 style={{ width: '100%' }}
                 onChange={handleStateChange}
                 value={selectedState}
               >
                 {states.map((state) => (
                   <Option key={state} value={state}>
                     {state}
                   </Option>
                 ))}
               </Select>
             </div>
             <div className="mt-2">
               <span>City</span>
               <Select
                 style={{ width: "100%" }}
                 onChange={handleCityChange}
                 value={selectedCity}
                 disabled={!selectedState}
               >
              {cities.map((city) => (
                   <Option key={city} value={city}>
                     {city}
                   </Option>
                 ))}
               </Select>
             </div>
        <div className="mt-2">
        <div>Annual Revenue range(in million)</div>
          <Select
            style={{ width: 200 }}
            onChange={(selectedRange) => setAnnualRevenueRange(selectedRange)}
          >
          {revenueRanges.map((range) => (
            <Option key={range.value} value={range.value}>
              {range.label}
            </Option>
          ))}
          </Select>
          </div>
          <div className="mt-2">
          <div>Team Size</div>
          <Select
            style={{ width: 200 }}
            onChange={(selectedRange) => setTeamSizeRange(selectedRange)}
          >
          {teamSizeRanges.map((range) => (
            <Option key={range.value} value={range.value}>
              {range.label}
            </Option>
          ))}
          </Select>
          </div>
  <div className="mt-2">
  <div>Growth from Last Year</div>
    <Select
      placeholder="Please select growth from last year"
      style={{ width: 200 }}
      onChange={(selectedGrowth) => setGrowthFromLastYear(selectedGrowth)}
      showSearch
    >
    {Array.from({length: 111}, (_, i) => i - 10).map(value => (
      <Select.Option key={value} value={value}>
        {value}%
      </Select.Option>
    ))}
    </Select>
  </div>
             <br />
           </Modal>
    </Card>
  )

}


export default OrganizationsList;


