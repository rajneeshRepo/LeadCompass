import React, { useState, useEffect } from "react";
import PageHeaderAlt from "components/layout-components/PageHeaderAlt";
import { Tabs, Form, Button, message } from "antd";
import Flex from "components/shared-components/Flex";
import GeneralField from "./GeneralField";
import { useParams } from 'react-router-dom';
import {RollbackOutlined} from '@ant-design/icons';
// import LeadService from "services/LeadService";

export const LeadProfile = () => {
  const param = useParams();
  const [lead, setLead] = useState({
    "organiation_name": "shorthills",
    "annual_revenue": "100M",
    "growth_from_last_year": "20",
    "team_size": "50",
    "office_phone": "7678221835",
    "website": "shorthills@ai",
    "city": "gurgaon",
    "state": "haryana"
});

//   useEffect(() => {
//     const { id } = param;
//     const leadId = parseInt(id);
//     // getLead(leadId);
//   }, []);

//   const getLead = async (id) => {
//     try {
//       const response = await LeadService.lead({ id });
//       console.log(response.lead);
//       setLead(response.lead);
//     } catch (error) {
//       // message.error(`Couldn't fetch lead`);
//     }
//   };

  return (
    <>
      <PageHeaderAlt className="border-bottom" overlap>
        <span>
         <RollbackOutlined /> Back
        </span>
        <div className="container-fluid">
          <Flex
            className="py-2"
            mobileFlex={false}
            justifyContent="space-between"
            alignItems="center"
          >
            <h2 className="mb-3">
              Organization Profile
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

// export default LeadProfile;
