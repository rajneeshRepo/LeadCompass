import React, {useState} from "react";
import {Card, Table} from "antd";
import {DownloadOutlined} from "@ant-design/icons"

import { transactions } from "./DefaultCompanyProfileData";

const TABLE_HEIGHT = 300;
const TABLE_SIZE = "middle";

const LatestTransactions = ({ lead }) => {
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const tableColumns = [
    {
      title: "Transaction ID",
      dataIndex: "fc_transaction_id",
      key: "fc_transaction_id",
      fixed: "left",
    },
    {
      title: "Property",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Transaction Date",
      dataIndex: "transaction_date",
      key: "transaction_date",
    },
    {
      title: "Grantor",
      dataIndex: "grantor",
      key: "grantor",
    },
    {
      title: "Grantee",
      dataIndex: "grantee",
      key: "grantee",
    },
    {
      title: "Party lead",
      dataIndex: "party_company",
      key: "party_company",
    },
    {
      title: "Cross Party lead",
      dataIndex: "cross_party_company",
      key: "cross_party_company",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Type",
      dataIndex: "transaction_type",
      key: "transaction_type",
    },
    {
      title: "County",
      dataIndex: "county",
      key: "county",
    },
    {
      title: "PDF",
      dataIndex: "pdf",
      key: "pdf",
      fixed: "right",
      render: (text, record) =>
        text && (
          <a href={text}>
            <DownloadOutlined />
          </a>
        ),
    },
  ];

  const handleTableChange = (pagination) => {
    setTableParams({ pagination: { ...pagination } });
  };

  return (
    <Card title="Latest Transactions">
      <Table
        size={TABLE_SIZE}
        className="no-border-last"
        bordered={true}
        columns={tableColumns}
        dataSource={transactions}
        rowKey="fc_transaction_id"
        pagination={tableParams.pagination}
        onChange={handleTableChange}
        scroll={{ x: 1500, y: TABLE_HEIGHT }}
      />
    </Card>
  );
};

export default LatestTransactions;
