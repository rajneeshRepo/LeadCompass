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
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getContactDetails(organizationId);
  }, []);

  const getContactDetails = async (id) => {
    // console.log("debuggerkjn")
    console.log(id) 
    try {
      const response = await ContactService.getContacts({id});
      const formattedContacts = response.result.map((contact) => ({
        _id: contact.id,
        name: contact.name,
        title: contact.title,
        primary_email: contact.primary_email,
        secondary_email: contact.secondary_email,
        linkedin: contact.linkedin,
        primary_contact: contact.primary_contact,
        secondary_contact: contact.secondary_contact
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
      // getContactDetails(organizationId);
    } catch (error) {
        message.error(error.message);
    }

    handleCancelModal();
  };

  const handleContactSubmit = () => {
    console.log(form.getFieldsValue());
    form.validateFields().then(async (values) => {
      const form_type = values.form_type;
      delete values.form_type

      const data = {...values, company_id: lead.id};

      if (form_type == "Add") {
        data.company_id = lead.id;

        try {
          data['user_email'] = localStorage.getItem("email");
          data["organization_id"] = organizationId;
          const response = await ContactService.createContact(data);
          message.success('Contact added successfully')
          handleCancelModal();
          getContactDetails(organizationId);
        } catch (error) {
          message.error("Add Request Failed.");
        }
      } 
      else {
        try{
          const response = await ContactService.updateContactById(data);
          message.success('Contact updated successfully')
          handleCancelModal();
          getContactDetails(organizationId);
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
        label: "Email ID (Primary)",
        children: <span className="text-capitalize">{contact.primary_email}</span>,
        // span: 1.5
      },
      {
        key: "4",
        label: "Email ID (Secondary)",
        children: <span className="text-capitalize">{contact.secondary_email}</span>,
        // span: 1.5
      },
      {
        key: "5",
        label: "LinkedIn ID",
        children: <a href={contact.linkedin}>{contact.linkedin}</a>,
        //   span: 1.5,
      },

      {
        key: "6",
        label: "Contact (Primary)",
        children: contact.primary_contact,
        //   span: 1.5
      },
      {
        key: "7",
        label: "Contact (Secondary)",
        children: contact.secondary_contact,
        //   span: 1.5
      }
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
