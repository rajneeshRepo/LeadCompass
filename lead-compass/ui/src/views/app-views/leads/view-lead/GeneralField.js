import React from "react";
import {
  Row,
  Col,
  Card,
} from "antd";

import BasicDetails from "./BasicDetails";
import LeadContacts from "./LeadContacts"
import LatestTransactions from "./LatestTransactions"

const GeneralField = ({ lead }) => {
  return (
    <>
      <Row gutter={26}>
        <Col xs={24} sm={24} md={24}>
          <Card title="Basic Details">
            <BasicDetails lead={lead}/>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24}>
          <LeadContacts lead={lead}/>
        </Col>
      </Row>
      <Row gutter={26}>
        <Col xs={24} sm={24} md={24}>
          <LatestTransactions lead={lead}/>
        </Col>
      </Row>
    </>
  );
};

export default GeneralField;
