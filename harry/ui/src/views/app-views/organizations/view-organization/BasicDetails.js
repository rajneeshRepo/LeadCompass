import React from "react";
import { Tag, Descriptions } from "antd";

const BasicDetails = ({lead}) => {
    const basic_items = [
        {
          key: "1",
          label: "Name",
          children: lead.name,
        },
        {
          key: "2",
          label: "Annual Revenue",
          children: lead.annual_revenue,
        },
        {
          key: "3",
          label: "Growth From Last Year",
          children: lead.growth_from_last_year,
        },
        {
          key: "4",
          label: "Team Size",
          children: lead.team_size,
        //   span: 1.5,
        },
        {
          key: "5",
          label: "Office Phone",
          children: lead.official_phone,
        //   span: 1.5,
        },
        {
          key: "6",
          label: "Website",
          children: lead.website,
        },
        {
          key: "7",
          label: "City",
          children: lead.county,
        },
        {
          key: "8",
          label: "State",
          children: lead.state,
        }
    ];

    return (<Descriptions size="small" bordered items={basic_items} />)
}


export default BasicDetails;