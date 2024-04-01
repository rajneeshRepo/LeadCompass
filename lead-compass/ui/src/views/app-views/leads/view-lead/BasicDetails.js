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
          label: "Last County",
          children: lead.last_county,
        },
        {
          key: "3",
          label: "Last Lender Used",
          children: lead.last_lender_used,
        },
        {
          key: "4",
          label: "Last Mortgage Date",
          children: lead.last_mortgage_date,
        //   span: 1.5,
        },
        {
          key: "5",
          label: "Last Transaction Date",
          children: lead.last_transaction_date,
        //   span: 1.5,
        },
        {
          key: "6",
          label: "Mortgage Transactions",
          children: lead.mortgage_transactions,
        },
        {
          key: "7",
          label: "Transactions As Borrower",
          children: lead.transactions_as_borrower,
        },
        {
          key: "8",
          label: "Transactions As Buyer",
          children: lead.transactions_as_buyer,
        },
        {
          key: "9",
          label: "Transactions As Lender",
          children: lead.transactions_as_lender,
        //   span: 1.5,
        },
        {
          key: "10",
          label: "Transactions As Seller",
          children: lead.transactions_as_seller,
        //   span: 1.5,
        },
        {
          key: "11",
          label: "Tags",
          children: lead.tag_names.map((tag) => {
            let color = tag.length > 7 ? "geekblue" : "green";
            if (tag === "borrower") {
              color = "volcano";
            }
            return (
              <Tag className="my-1" color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          }),
        },
        {
          key: "12",
          label: "Principal Address",
          children: lead.principal_address || "--",
        //   span: 1.5,
        },
    ];

    return (<Descriptions size="small" bordered items={basic_items} />)
}

export default BasicDetails;