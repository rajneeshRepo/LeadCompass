import React from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Radio,
} from "antd";

const validateName = (_, value) => {
  value = value && value.trim();

  if (value && value.length < 3) {
    return Promise.reject("Minimum length is 3 characters");
  }

  return Promise.resolve();
};

const validateLinkedInUrl = (_, url) => {
  url = url && url.trim();

  if (url) {
    const pattern =
      /(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub|profile)\/[a-zA-Z0-9-_]+\/?/;
    const match = url.match(pattern);

    if (!match) return Promise.reject("Please enter valid url");
  }
  return Promise.resolve();
};

const rules = {
  name: [
    {
      required: true,
      message: "Please enter name",
    },
    {
      validator: validateName,
    },
  ],
//   last_name: [],
  email: [
    {
      required: false,
    },
    {
      type: "email",
      message: "Please enter a valid email!",
    },
  ],
  linkedin: [
    {
      required: false,
      message: "Please enter linkedIn",
    },
    {
      validator: validateLinkedInUrl,
      message: "Please enter valid linkedIn",
    },
  ],
  contact_primary: [
    {
      required: true,
      message: "Please enter contact",
    },
  ],
};

const ContactForm = ({ onSubmit }) => {
  const options = [
    {
      label: "Primary",
      value: "primary",
    },
    {
      label: "Secondary",
      value: "secondary",
    },
  ];

  return (
    <>
      <Row gutter={16}>
        <Col xs={12} xl={12} xxl={8}>
          <Form.Item
            rules={rules.name}
            label="Name"
            name={"name"}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={12} xl={12} xxl={8}>
          <Form.Item label="Title" name={"title"}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={12} xl={12} xxl={8}>
          <Form.Item rules={rules.email} label="Email" name={"email"}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={12} xl={12} xxl={8}>
          <Form.Item
            rules={rules.linkedin}
            label="LinkedIn Id"
            name={"linkedIn"}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={12} xl={12} xxl={8}>
          <Form.Item
            rules={rules.contact_primary}
            label="Contact"
            name={"primary_contact"}
          >
            <Input />
          </Form.Item>
        </Col>
      {/* </Row> */}
      {/* <Row gutter={16}> */}
        
        
        {/* <Col xs={12} xl={12} xxl={8}>
          <Form.Item label="Contact Secondary" name={"secondary_contact"}>
            <Input />
          </Form.Item>
        </Col> */}
      </Row>
      {/* <Form.Item
        name="contact_type"
        label="Contact Type"
      >
        <Radio.Group
          options={options}
          optionType="button"
          buttonStyle="solid"
        />
      </Form.Item> */}

      {/* Just For holding contact id and form_type */}
      <Form.Item hidden name={"id"}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={"form_type"}>
        <Input />
      </Form.Item>
    </>
  );
};

export default ContactForm;
