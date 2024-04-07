import React, { useState,useEffect } from "react";
import { Card, Form, Input, Button, Row, Col, message,Space,Select } from "antd";
import { useNavigate,useParams, useLocation } from "react-router-dom";
// import { useQueryClient } from "react-query";
import { GlobalOutlined , PhoneOutlined , TeamOutlined, UserAddOutlined,MinusCircleOutlined,PlusOutlined } from "@ant-design/icons";
// import { useMutation } from "react-query";
// import { useOrganization } from "context/organization-context";
// import { useUser } from "context/user-context";
import ApiService from 'services/ApiService';
import "./style.css";
import usa_state from "../../../../assets/data/usa_state.json";
const Option = {Select};
const states = Object.keys(usa_state);

export const AddNewOrganization = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const [form] = Form.useForm();
  const [cities, setCities] = useState([]);
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
    // Add more ranges as needed
  ];
  
  <Form.Item
    name="annual_revenue"
    label="Annual Revenue"
    rules={[
      {
        required: true,
        message: "Please select annual revenue",
      },
    ]}
  >
    <Select placeholder="Please select annual revenue">
      {revenueRanges.map(range => (
        <Select.Option key={range.value} value={range.value}>
          {range.label}
        </Select.Option>
      ))}
    </Select>
  </Form.Item>

  useEffect(() => {
    if (type === 'create') {
      // Add new resource
    } else if (type === 'edit' && id) {
      // Fetch data for the old resource
      fetchOldData(id);
    }
  }, [type, id]);

const fetchOldData = async (id) => {

}

const handleStateSelect = (selectedState) => {
      // Update the cities array based on the selected state
      // This is just a placeholder. Replace it with your actual logic.
      let selectedStateCities = usa_state[selectedState];
      setCities(selectedStateCities);
    };

  const onFinish =async(values) => {
    values['user_email'] = localStorage.getItem("email");
    if (values['decisionMakers']==undefined||values['decisionMakers']==null){ 
      values['decisionMakers'] = [];
    } 
    let response =  await ApiService.harryBackendApi(`organization`,"post",null,values);
    alert("Organization added successfully");
    navigate("/app/organizations");
  };

  return (
    <div>
    <Card title="Add New Organization">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              name="name"
              label="Organization Name"
              rules={[
                {
                  required: true,
                  message: "Please enter organization name",
                },
              ]}
            >
              <Input placeholder="Please enter organization name" />
            </Form.Item>
          </Col>
          </Row>
          <Row gutter={16}>
          <Col span={12}>
          <Form.Item
  name="annual_revenue"
  label="Annual Revenue"
  rules={[
    {
      required: true,
      message: "Please select annual revenue",
    },
  ]}
>
  <Select placeholder="Please select annual revenue" showSearch>
    {revenueRanges.map(range => (
      <Select.Option key={range.value} value={range.value}>
        {range.label}
      </Select.Option>
    ))}
  </Select>
</Form.Item>
          </Col>
        </Row>
      
        <Row gutter={16}>
          <Col span={12}>
          <Form.Item
          name="growth_from_last_year"
          label="Growth from last year"
          rules={[
            {
              required: true,
              message: "Please select growth from last year",
            },
            ]}
>
  <Select placeholder="Please select growth from last year" showSearch>
    {Array.from({length: 111}, (_, i) => i - 10).map(value => (
      <Select.Option key={value} value={value} showSearch>
        {value}%
      </Select.Option>
    ))}
  </Select>
</Form.Item>
          </Col>
          </Row>
          <Row gutter={16}>
          <Col span={12}>
          <Form.Item
          name="team_size"
          label="Team Size"
          rules={[
            {
              required: true,
              message: "Please select team size",
            },
          ]}
          >
  <Select placeholder="Please select team size">
    {teamSizeRanges.map(range => (
      <Select.Option key={range.value} value={range.value}>
        {range.label}
      </Select.Option>
    ))}
  </Select>
</Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="official_phone" // Add this field
              label={(
                <span>
                  Phone <PhoneOutlined />
                </span>
              )}
              rules={[
                {
                  // required: true,
                  message: "Please enter office phone",
                },
              ]}
            >
              <Input placeholder="Please enter office phone" />
            </Form.Item>
          </Col>

        </Row> 
        {/* Add Image just beside website title */}
        
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item
                name="website" 
                label={(
                    <span>
                      Website <GlobalOutlined />
                    </span>
                  )}
                rules={[
                    {
                    // required: true,
                    message: "Please enter website",
                    },
                ]}
                >
                <Input placeholder="Please enter website" />
                </Form.Item>      
            </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
         <Form.Item
 name="state"
 label="State"
  rules={[
   {
      required: true,
      message: "Please select a state",
   },
  ]}
>
  <Select onSelect={handleStateSelect} showSearch>
   {states.map((state) => (
      <Select.Option key={state} value={state}>
        {state}
      </Select.Option>
    ))}
  </Select>
</Form.Item>
          </Col>
        
       
          <Col span={12}>
             <Form.Item
             name="city"
             label="City"
             rules={[
  {
     required: true,
     message: "Please select a county",
   },
 ]}>
 <Select showSearch>
   {cities.map((city) => (
      <Select.Option key={city} value={city}>
       {city}
    </Select.Option>
    ))}
  </Select>
  </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          {/* <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              navigate("/app/organizations/create");
            }}
          >
            Add Organization
          </Button> */}
        </Form.Item>



    {/* write to create a form for decision makers */}

    <Card title="Add New Decision Maker">

  <Form.List name="decisionMakers">
    {(fields, { add, remove }) => (
      <>
        {fields.map((field, index) => (
          <div key={field.key}>
            <Card
                    key={field.key}
                    style={{ marginBottom: 16 }}
                    title={`Decision Maker ${index + 1}`}
                    extra={<Button icon={<MinusCircleOutlined />} onClick={() => remove(index)} />}
                  >
            <Row gutter={16}>
              <Col span={12}>
              <Form.Item
                  {...field}
                  name={[field.name, 'id']}
                  hidden
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  {...field}
                  name={[field.name, 'name']}
                  label="Decision Maker Name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter decision maker name",
                    },
                  ]}
                >
                  <Input placeholder="Please enter decision maker name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...field}
                  name={[field.name, 'title']}
                  label="Title"
                  rules={[
                    {
                      required: true,
                      message: "Please enter title",
                    },
                  ]}
                >
                  <Input placeholder="Please enter title" />
                </Form.Item>
                </Col>
              <Col span={12}>
                <Form.Item
                {...field}
                name={[field.name, 'primary_email']}
                label="Primary Email"
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please enter your E-mail!',
                  },
                  ]}
>
  <Input placeholder="Please enter primary email" />
  </Form.Item>
  </Col>
        <Col span={12}>
            <Form.Item
            {...field}
            name={[field.name, 'secondary_email']}
            label="Secondary Email"
              rules={[
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                {
                  required: false,
                  message: 'Please enter your E-mail!',
                },
              ]}
            >
              <Input placeholder="Please enter secondary email" />
            </Form.Item>
          </Col>
<Col span={12}>
                <Form.Item
                {...field}
                name={[field.name, 'primary_contact']}
                label="Primary Contact"
                  rules={[
                    {
                      required: true,
                      message: "Please enter primary contact",
                    },
                  ]}
                  >
      <Input placeholder="Please enter primary contact" />
    </Form.Item>
    </Col>
              <Col span={12}>
    <Form.Item
      {...field}
      name={[field.name, 'secondary_contact']}
      label="Secondary Contact"
      rules={[
        {
          required: false,
          message: "Please enter secondary contact",
        },
      ]}
    >
      <Input placeholder="Please enter secondary contact" />
    </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...field}
                  name={[field.name, 'linkedin']}
                  label="LinkedIn"
                  rules={[
                    {
                      required: true,
                      message: "Please enter LinkedIn",
                    },
                  ]}
                >
                  <Input placeholder="Please enter LinkedIn" />
                </Form.Item>
                </Col>
            </Row>
            </Card>
          </div>
        ))}
        <Form.Item>
          <Button
            type="primary"
            onClick={() => {
              add();
              navigate("/app/organizations/create");
            }}
          >
            <span style={{ marginRight: 8 }}>
              <UserAddOutlined />
            </span>
            Add Decision Maker
          </Button>
        </Form.Item>
      </>
    )}
  </Form.List>

    </Card>

    {/* Add Button For Add Organization or cancel Organization */}
    <Row justify="end" >
    <Form.Item>
      <Col>
        <Button
          type="secondary"
          onClick={() => {
            navigate("/app/organizations");
          }}
          className="cancelButton"
        >
          Cancel
        </Button>
      </Col>
      </Form.Item>
      <Col>
      <Form.Item>
    <Button
      type="primary"
      htmlType="submit"
      // onClick={() => {
      //   navigate("/app/organizations/create");
      // }}
    >
      Add Organization
    </Button>
  </Form.Item>
      </Col>
    </Row>
    </Form>
    </Card>
    </div>


  );
};
