import React from "react";
import { Tag, Descriptions } from "antd";

const BasicDetails = ({lead}) => {
    const basic_items = [
        {
          key: "1",
          label: "Name",
          children: lead.organiation_name,
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
          children: lead.office_phone,
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
          children: lead.city,
        },
        {
          key: "8",
          label: "State",
          children: lead.state,
        },
        // {
        //   key: "9",
        //   label: "Transactions As Lender",
        //   children: lead.transactions_as_lender,
        // //   span: 1.5,
        // },
        // {
        //   key: "10",
        //   label: "Transactions As Seller",
        //   children: lead.transactions_as_seller,
        // //   span: 1.5,
        // }
        // {
        //   key: "11",
        //   label: "Tags",
        //   children: lead.tag_names.map((tag) => {
        //     let color = tag.length > 7 ? "geekblue" : "green";
        //     if (tag === "borrower") {
        //       color = "volcano";
        //     }
        //     return (
        //       <Tag className="my-1" color={color} key={tag}>
        //         {tag.toUpperCase()}
        //       </Tag>
        //     );
        //   }),
        // },
        // {
        //   key: "12",
        //   label: "Principal Address",
        //   children: lead.principal_address || "--",
        // //   span: 1.5,
        // },
    ];

    return (<Descriptions size="small" bordered items={basic_items} />)
}

export default BasicDetails;