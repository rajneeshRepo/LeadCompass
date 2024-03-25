import React, { useState, useEffect } from "react";
// import { AddNewProject } from "./add-new-project";
import { AddNewOrganization } from "./add-new-organization";
import { css } from "@emotion/react";
import { Card, Flex, Button, Form, Table, Select, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  useNavigate,
  useLocation,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
// import NoProjectsImage from "assets/images/no_projects.png";
import OrganizationsList from "./organization-list"


const SORT_OPTIONS = ["First entry", "Last entry"];
const SOURCE_OPTIONS = ["All sources", "CSV", "Forecasa", "Black Knight"];
const PROJECTS = [
  {
    name: "November_sales_data_A122",
    date: "Just Now",
    source_type: "CSV Upload",
    uploaded_by: "mudit.s@sbibank.com",
    status: "Raw",
  },
];

const { Option } = Select;
export const Organizations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // console.log(location.search);
  // const queryParams = new URLSearchParams(location.search);
  // console.log(queryParams);

  const handleFormSubmit = (values) => {
    console.log(values);
  };

  const columns = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
      width: "25%",
    },
    {
      title: "Date",
      key: "date",
      dataIndex: "date",
      width: "20%",
    },
    {
      title: "Source Type",
      key: "source_type",
      dataIndex: "source_type",
      width: "20%",
    },
    {
      title: "Uploaded By",
      key: "uploaded_by",
      dataIndex: "uploaded_by",
      width: "20%",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      width: "15%",
    },
  ];

  const rowProps = (record) => {
    return {
      onClick: () => navigate(`/app/projects/${record.name}`),
    };
  };

  return (
    <>
      <Routes>
        <Route path="" element={<OrganizationsList />}></Route>
        <Route path="create" element={<AddNewOrganization />}></Route>
        {/* <Route
          path=":projectId"
          element={<Navigate to="modules" replace />}
        ></Route>
        <Route path="*" element={<Navigate to="" replace />}></Route> */}
      </Routes>

      <Outlet />
    </>
  );
};

export default Organizations;
