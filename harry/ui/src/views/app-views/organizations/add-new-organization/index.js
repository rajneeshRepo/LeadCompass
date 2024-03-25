import React, { useState } from "react";
import { Card, Form, Input, Button, Row, Col, message } from "antd";
import { useNavigate } from "react-router-dom";
// import { useQueryClient } from "react-query";
import { GlobalOutlined , PhoneOutlined , TeamOutlined } from "@ant-design/icons";
// import { useMutation } from "react-query";
// import { useOrganization } from "context/organization-context";
// import { useUser } from "context/user-context";
import { useLocation } from "react-router-dom";

export const AddNewOrganization = () => {
  const navigate = useNavigate();
  // const { user } = useAuth();
  // const queryClient = useQueryClient();
  // const { organization, setOrganization } = useOrganization();
  // const { user: userState } = useUser();
  const [form] = Form.useForm();
  const location = useLocation();
  // const [mutate] = useMutation(addOrganization, {
  //     onSuccess: () => {
  //     queryClient.invalidateQueries("organizations");
  //     message.success("Organization added successfully");
  //     navigate("/app/organizations/create");
  //     },
  // });

//   const WebsiteLabel = () => (
//     <div style={{ display: 'flex', alignItems: 'center' }}>
//       <img src={<PlusOutlined/>} alt="Website" style={{ marginRight: 8 }} /> {/* Adjust styles as needed */}

//     </div>
//   );

  const onFinish = (values) => {
    const data = {
      name: values.name,
      annual_revenue: values.annual_revenue,
      decision_makers: values.decision_makers,
      // user_id: user.id,
    };
    // mutate(data);
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
              name="Growth from last year" // Add this field
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
              name="Team Size" // Add this field
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
              name="Office Phone" // Add this field
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
              name="County" // Add this field
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
              name="State" // Add this field
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
      </Form>
    </Card>

    {/* write to create a form for decision makers */}

    <Card title="Add New Decision Maker">

    <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
            <Col span={16}>
            <Form.Item
                name="name"
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
        </Row>
        <Row gutter={16}>
        <Col span={12}>
            <Form.Item
                name="title"
                label="Title"
                rules={[
                {
                    // required: true,
                    message: "Please enter Designation",
                },
                ]}
            >
                <Input placeholder="Please enter designation" />
            </Form.Item>
            </Col>

            <Col span={12}>
            <Form.Item
                name="email"
                label="Email"
                rules={[
                {
                    // required: true,
                    message: "Please enter email",
                },
                ]}
            >
                <Input placeholder="Please enter email" />
            </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
        <Col span={12}>
            <Form.Item
                name="linkedin"
                label="linkedin"
                rules={[
                {
                    // required: true,
                    message: "Please enter linkedin",
                },
                ]}
            >
                <Input placeholder="Please enter linkedin" />
            </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item
                name="phone"
                label="Phone"
                rules={[
                {
                    // required: true,
                    message: "Please enter phone",
                },
                ]}
            >
                <Input placeholder="Please enter phone" />
            </Form.Item>
            </Col>
        </Row>
        <Form.Item>
            <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
                navigate("/app/organizations/create");
            }}
            >
            Add Decision Maker
            </Button>
        </Form.Item>
    </Form>
    </Card>

    {/* Add Button For Add Organization or cancel Organization */}
    <Row justify="space-between">
      <Col>
        <Button
          type="primary"
          htmlType="submit"
          onClick={() => {
            navigate("/app/organizations");
          }}
        >
          Cancel
        </Button>
      </Col>
      <Col>
        <Button
          type="primary"
          htmlType="submit"
          onClick={() => {
            navigate("/app/organizations");
          }}
        >
          Add Organization
        </Button>
      </Col>

    </Row>
    </div>


  );
};
