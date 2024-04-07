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
  title:[
    {
      required: true,
      message: "Please enter title",
    }
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
      required: true,
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
        <Col xs={12} xl={12} xxl={12}>
          <Form.Item
            rules={rules.name}
            label="Name"
            name={"name"}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={12} xl={12} xxl={12}>
          <Form.Item label="Title" name={"title"} rules={rules.title}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={12} xl={12} xxl={12}>

            <Form.Item name="primary_email"
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
<Col xs={12} xl={12} xxl={12}>
<Form.Item
  name="secondary_email"
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

        <Col xs={12} xl={12} xxl={8}>
            <Form.Item name="primary_contact"
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
            <Col xs={12} xl={12} xxl={8}>
            <Form.Item
      name="secondary_contact"
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

  <Col xs={12} xl={12} xxl={8}>
          <Form.Item
            rules={rules.linkedin}
            label="LinkedIn Id"
            name={"linkedin"}
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
      <Form.Item hidden name={"_id"}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={"form_type"}>
        <Input />
      </Form.Item>
    </>
  );
};

export default ContactForm;
