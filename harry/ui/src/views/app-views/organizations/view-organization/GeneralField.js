import React from "react";
import {
    Flex,
    Card,
    Dropdown,
    Row,
    Col,
  
  } from "antd";
import {
MoreOutlined,
PlusOutlined,
EditOutlined,
DeleteOutlined,
} from "@ant-design/icons";
  

import { SPACER } from "constants/ThemeConstant";

import BasicDetails from "./BasicDetails";
import ContactDetails from "./ContactDetail";


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
        // onClick: () => openContactFormModal(contact),
      },
      {
        key: "Remove",
        label: (
          <Flex alignItems="center" gap={SPACER[2]}>
            <DeleteOutlined />
            <span className="ml-2">Remove</span>
          </Flex>
        ),
        // onClick: () => openConfirmModal(contact),
      },
    ];
  };



const GeneralField = ({ lead }) => {
  return (
    <>
      <Row gutter={26}>
        <Col xs={24} sm={24} md={24}>
          <Card title="Basic Details"
                extra={<CardDropdown items={getContactOptions(lead)} />}>
            <BasicDetails lead={lead}/>
            {/* {JSON.stringify(lead)} */}
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24}>
          <ContactDetails lead={lead}/>
          {console.log(lead)}
          {console.log('jsw')}
          {/* {JSON.stringify(lead)} */}
        </Col>
      </Row>
    </>
  );
};

export default GeneralField;
