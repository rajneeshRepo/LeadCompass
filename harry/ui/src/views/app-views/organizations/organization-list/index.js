import React, { useState, useEffect } from "react";
// import { AddNewProject } from "../add-new-project";
import { Card, Flex, Button, Form, Table, Select, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useLocation, Routes, Route, Outlet } from "react-router-dom";
// import NoProjectsImage from "assets/images/no_projects.png";

// const TABLE_SIZE = 10
const PROJECTS = [
  {
    name: "Shorthills AI",
    organization_id: "77",
    annual_revenue: "$1M",
    decision_makers: "Ujjwal",
  },
  {
    name: "Shorthills AI",
    organization_id: "77",
    annual_revenue: "$1M",
    decision_makers: "Ujjwal",
  },
  {
    name: "Shorthills AI",
    organization_id: "77",
    annual_revenue: "$1M",
    decision_makers: "Ujjwal",
  },
  {
    name: "Shorthills AI",
    organization_id: "77",
    annual_revenue: "$1M",
    decision_makers: "Ujjwal",
  },
  {
    name: "Shorthills AI",
    organization_id: "77",
    annual_revenue: "$1M",
    decision_makers: "Ujjwal",
  },
  {
    name: "Shorthills AI",
    organization_id: "77",
    annual_revenue: "$1M",
    decision_makers: "Ujjwal",
  },
  {
    name: "Shorthills AI",
    organization_id: "77",
    annual_revenue: "$1M",
    decision_makers: "Ujjwal",
  },
  {
    name: "Shorthills AI",
    organization_id: "77",
    annual_revenue: "$1M",
    decision_makers: "Ujjwal",
  },
  {
    name: "Shorthills AI",
    organization_id: "77",
    annual_revenue: "$1M",
    decision_makers: "Ujjwal",
  },
  {
    name: "Shorthills AI",
    organization_id: "77",
    annual_revenue: "$1M",
    decision_makers: "Ujjwal2",
  },
  {
    name: "Shorthills AII",
    organization_id: "77",
    annual_revenue: "$1M",
    decision_makers: "Ujjwal3",
  },

];


const { Option } = Select;
export const OrganizationsList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.search);
  const queryParams = new URLSearchParams(location.search);
  console.log(queryParams);

  const handleFormSubmit = (values) => {
    console.log(values);
  };

  const columns = [
    {
      title: "Organization Name",
      key: "name",
      dataIndex: "name",
      width: "25%",
    },
    {
      title: "Organization Id",
      key: "organization_id",
      dataIndex: "organization_id",
      width: "20%",
    },
    {
      title: "Annual Revenue",
      key: "annual_revenue",
      dataIndex: "annual_revenue",
      width: "20%",
    },
    {
      title: "Decision Makers",
      key: "decision_makers",
      dataIndex: "decision_makers",
      width: "20%",
    },
  ];

  const rowProps = (record) => {
    return {
      onClick: () => navigate(`/app/projects/${record.name}`),
    };
  };

  return (
    <Card style={{ height: "90%" }} bodyStyle={{ height: "100%" }}>
      {queryParams["size"] == 1 ? (
        <Flex className="h-100 mt-5" justify="center" align="space-around">
          <Flex vertical align="center">
            <h2>Organizations</h2>
            {/* <img src={NoProjectsImage}></img> */}

            {/* <p className="text-center">
              Projects are latest data sets pulled in from various sources.{" "}
              <br /> Create a new project to get started
            </p> */}

            <Button
              onClick={() => {
                navigate("/app/organizations/create");
              }}
              type="primary"
              icon={<PlusOutlined />}
            >
              Add Organization
            </Button>
          </Flex>
        </Flex>
      ) : (
        <>
          <Flex justify="space-between">
            <h2>Organizations</h2>
            <Button
              onClick={() => navigate("/app/organizations/create")}
              type="primary"
              icon={<PlusOutlined />}
            >
              Add Organization
            </Button>
          </Flex>

          {/* Add Organization search bar here */}
          <Row className="mt-3">
            <Col span={6}>
              <Form onFinish={handleFormSubmit}>
                <Form.Item name="organization">
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Search Organizations"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="1">Organization 1</Option>
                    <Option value="2">Organization 2</Option>
                    <Option value="3">Organization 3</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Col>

            <Col span={6}>
              <Form onFinish={handleFormSubmit}>
                <Form.Item name="decisionMaker">
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Search Decision Makers"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="1">Ujjwal</Option>
                    <Option value="2">Rahul</Option>
                    <Option value="3">Saurabh</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Col>
          </Row>
          

          <Table
            onRow={rowProps}
            // size={TABLE_SIZE}
            // pagination={pagination}
            className="no-border-last"
            rowKey="name"
            columns={columns}
            // loading={loading}
            dataSource={PROJECTS}
            // scroll={{ x: TABLE_WIDTH, y: TABLE_HEIGHT }}
            // onChange={handleTableChange}
          />
        </>
      )}
    </Card>
  );
};

export default OrganizationsList;
