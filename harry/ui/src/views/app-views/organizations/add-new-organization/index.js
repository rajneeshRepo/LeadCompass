import React, { useState,useEffect } from "react";
import { Card, Form, Input, Button, Row, Col, message } from "antd";
import { useNavigate,useParams, useLocation } from "react-router-dom";
// import { useQueryClient } from "react-query";
import { GlobalOutlined , PhoneOutlined , TeamOutlined, UserAddOutlined,MinusCircleOutlined } from "@ant-design/icons";
// import { useMutation } from "react-query";
// import { useOrganization } from "context/organization-context";
// import { useUser } from "context/user-context";
import ApiService from 'services/ApiService';
import "./style.css";

export const AddNewOrganization = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const [form] = Form.useForm();


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
                  // required: true,
                  message: "Please enter annual revenue",
                },
              ]}
            >
              <Input placeholder="Please enter annual revenue" />
            </Form.Item>
          </Col>
        </Row>
      
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="growth_from_last_year" // Add this field
              label="Growth from last year"
              rules={[
                {
                  // required: true,
                  message: "Please enter growth from last year",
                },
              ]}
            >
              <Input placeholder="Please enter growth from last year" />
            </Form.Item>
          </Col>
          </Row>
          <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="team_size" // Add this field
              label={(
                <span>
                  Team Size <TeamOutlined />
                </span>
              )}
              rules={[
                {
                  // required: true,
                  message: "Please enter team size",
                },
              ]}
            >
              <Input placeholder="Please enter team size" />
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
              name="county" // Add this field
              label="County"
              rules={[
                {
                  // required: true,
                  message: "Please enter county",
                },
              ]}
            >
              <Input placeholder="Please enter county" />
            </Form.Item>
          </Col>
        
       
          <Col span={12}>
            <Form.Item
              name="state" // Add this field
              label="State"
              rules={[
                {
                  // required: true,
                  message: "Please enter state",
                },
              ]}
            >
              <Input placeholder="Please enter state" />
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
              <Col span={16}>
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
                <Form.Item
                  {...field}
                  name={[field.name, 'title']}
                  label="Title"
                  rules={[
                    {
                      required: false,
                      message: "Please enter title",
                    },
                  ]}
                >
                  <Input placeholder="Please enter title" />
                </Form.Item>
                <Form.Item
                  {...field}
                  name={[field.name, 'email']}
                  label="Email"
                  rules={[
                    {
                      required: false,
                      message: "Please enter email",
                    },
                  ]}
                >
                  <Input placeholder="Please enter email" />
                </Form.Item>
                <Form.Item
                  {...field}
                  name={[field.name, 'linkedin']}
                  label="LinkedIn"
                  rules={[
                    {
                      required: false,
                      message: "Please enter LinkedIn",
                    },
                  ]}
                >
                  <Input placeholder="Please enter LinkedIn" />
                </Form.Item>
                <Form.Item
                  {...field}
                  name={[field.name, 'phone']}
                  label="Phone"
                  rules={[
                    {
                      required: false,
                      message: "Please enter phone",
                    },
                  ]}
                >
                  <Input placeholder="Please enter phone" />
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
