import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Flex,
  Card,
  Dropdown,
  Descriptions,
  Row,
  Col,
  Form,
  message,
  Modal,
} from "antd";
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";

import ContactForm from "./ContactForm";
import { SPACER } from "constants/ThemeConstant";
import EmptyData from "components/util-components/EmptyData";
// import OrganizationService from "services/OrganizationService"
import ContactService from "services/ContactService";

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

const ContactDetails = ({ lead }) => {

  const [form] = Form.useForm();
  const { organizationId } = useParams();
  const [contacts, setContacts] = useState([{
  "name": "ujjwal",
  "title": "sde1",
  "email": "uk@gmail.com",
  "linkedin": "linkedin.com",
  "primary_contact": "7678221835"
}]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getContactDetails(organizationId);
  }, []);

  const getContactDetails = async (id) => {
    console.log("debuggerkjn")
    console.log(id) 
    try {
      const response = await ContactService.getContacts({id});
      const formattedContacts = response.result.map((contact) => ({
        name: contact.name,
        title: contact.title,
        email: contact.email,
        linkedIn: contact.linkedIn,
        primary_contact: contact.primary_contact,
      }));
      setContacts(formattedContacts);
    } catch (error) {
      message.error(`Couldn't get contacts.`);
    }
  };

  const deleteContact = async (id) => {
    try {
      const response = await ContactService.deleteContactById({ id });
      message.success('Contact deleted successfully')
      getContactDetails();
    } catch (error) {
        message.error(error.message);
    }

    handleCancelModal();
  };

  const handleContactSubmit = () => {
    console.log("debugger")
    console.log(form.getFieldsValue());
    form.validateFields().then(async (values) => {
      const form_type = values.form_type;
      delete values.form_type

      const data = {...values, company_id: lead.id};

      if (form_type == "Add") {
        data.company_id = lead.id;

        try {
          const response = await ContactService.createContact(data);
          message.success('Contact added successfully')
          handleCancelModal();
          getContactDetails();
        } catch (error) {
          message.error("Add Request Failed.");
        }
      } 
      else {
        try{
          const response = await ContactService.updateContactById(data);
          message.success('Contact updated successfully')
          handleCancelModal();
          getContactDetails();
        }catch(error){
          message.error('Update Request Failed.')
        }
      }
    });
  };

  const openConfirmModal = (contact) => {
    Modal.confirm({
      title: "Confirm Delete Contact",
      icon: <ExclamationCircleFilled />,
      content: `Once a contact is deleted, it cannot be recovered`,
      onOk: () => deleteContact(contact.id),
      onCancel: () => handleCancelModal(),
    });
  };

  const openContactFormModal = (contact) => {
    setIsModalOpen(true);
    if (contact) {
      contact.form_type = "Update";
      form.setFieldsValue(contact);
    } else {
      form.setFieldsValue({ form_type: "Add" });
    }

    console.log(form.getFieldsValue());
  };

  const getContactItems = (contact) => {
    return [
      {
        key: "1",
        label: "Name",
        children: contact.name,
        //   span: 1
      },
      {
        key: "2",
        label: "Title",
        children: (
            <span className="text-capitalize">{contact.title}</span>
          ),
        //   span: 1
      },
      {
        key: "3",
        label: "Email ID",
        children: <span className="text-capitalize">{contact.email}</span>,
        // span: 1.5
      },
      {
        key: "4",
        label: "Linkedin ID",
        children: <a href={contact.linkedIn}>{contact.linkedIn}</a>,
        //   span: 1.5,
      },

      {
        key: "5",
        label: "Contact (Primary)",
        children: contact.primary_contact,
        //   span: 1.5
      },

      
    ];
  };

  const getContactOptions = (contact) => {
    return [
      {
        key: "Update",
        label: (
          <Flex alignItems="center" gap={SPACER[2]}>
            <EditOutlined />
            <span className="ml-2">Update</span>
          </Flex>
        ),
        onClick: () => openContactFormModal(contact),
      },
      {
        key: "Remove",
        label: (
          <Flex alignItems="center" gap={SPACER[2]}>
            <DeleteOutlined />
            <span className="ml-2">Remove</span>
          </Flex>
        ),
        onClick: () => openConfirmModal(contact),
      },
    ];
  };

  const addContactOptions = [
    {
      key: "Add",
      label: (
        <Flex alignItems="center" gap={SPACER[2]}>
          <PlusOutlined />
          <span className="ml-2">Add</span>
        </Flex>
      ),
      onClick: () => openContactFormModal(),
    },
  ];

  const handleCancelModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Card
        title="Decison Makers"
        extra={<CardDropdown items={addContactOptions} />}
      >
        <Row
          className="p-1"
        //   style={{ width: "100%", maxHeight: "40vh", overflow: "scroll" }}
          size="large"
          direction="vertical"
        >
          {contacts.map((contact, index) => {
            return (
              <Col key={index} className="p-3" span={24}>
                <Descriptions
                  bordered
                  size="middle"
                  title={`Contact ${index + 1}`}
                  items={getContactItems(contact)}
                  extra={
                    <CardDropdown
                      id={contact.id}
                      items={getContactOptions(contact)}
                    />
                  }
                />
              </Col>
            );
          })}
          {contacts.length == 0 && <EmptyData message="No contact added" buttonText="Add Contact" onClick={() => openContactFormModal()}/>}
        </Row>
      </Card>

      <Modal
        okText="submit"
        width="60vw"
        title={`${form.getFieldValue("form_type")} contact`}
        open={isModalOpen}
        onOk={handleContactSubmit}
        onCancel={handleCancelModal}
      >
        <Form size="small" initialValues={{ contact_type: "primary" }} form={form}>
          <ContactForm />
        </Form>
      </Modal>
    </>
  );
};

export default ContactDetails;
