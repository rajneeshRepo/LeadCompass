import React, { useState, useEffect } from "react";
import PageHeaderAlt from "components/layout-components/PageHeaderAlt";
import { Tabs, Form, Button, message } from "antd";
import Flex from "components/shared-components/Flex";
import GeneralField from "./GeneralField";
import { useParams } from 'react-router-dom';
import LeadService from "services/LeadService";

const LeadProfile = () => {
  const param = useParams();
  const [lead, setLead] = useState();

  useEffect(() => {
    const { id } = param;
    const leadId = parseInt(id);
    getLead(leadId);
  }, []);

  const getLead = async (id) => {
    try {
      const response = await LeadService.lead({ id });
      console.log(response.lead);
      setLead(response.lead);
    } catch (error) {
      // message.error(`Couldn't fetch lead`);
    }
  };

  return (
    <>
      <PageHeaderAlt className="border-bottom" overlap>
        <div className="container-fluid">
          <Flex
            className="py-2"
            mobileFlex={false}
            justifyContent="space-between"
            alignItems="center"
          >
            <h2 className="mb-3">
              Lead Profile
            </h2>
          </Flex>
        </div>
      </PageHeaderAlt>
      <div className="container-fluid">
        <Tabs
          defaultActiveKey="1"
          style={{ marginTop: 30 }}
          items={[
            {
              label: "General",
              key: "1",
              children: lead && <GeneralField lead={lead} />,
            },
          ]}
        />
      </div>
    </>
  );
};

export default LeadProfile;
