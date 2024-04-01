import React, { useState, useEffect } from "react";
import { Table, Form, Card, message } from "antd";

import Filters from "components/util-components/CompanyFilters";
import CompanyService from "services/CompanyService";
import { STATES } from "./DefaultDashboardData";
import {
  columns,
  TABLE_HEIGHT,
  TABLE_WIDTH,
  TABLE_SIZE,
} from "constants/CompanyTableConstant";

export const DefaultDashboard = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);

  const [pagination, setTablePagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    form.validateFields().then(() => getCompanies());
  }, [pagination.current, pagination.pageSize]);

  const handleTableChange = (pagination) => {
    setTablePagination(pagination);
  };

  const getCompanies = async () => {
    setLoading(true);

    const filters = getFilters();

    try {
      const response = await CompanyService.companies(filters);
      if (response.companies) setCompanies(response.companies);
      if (response.companies_total_count) {
        setTablePagination({
          ...pagination,
          total: response.companies_total_count,
        });
      }

      setLoading(false);
    } catch (error) {
      message.error(`Something wents wrong`);
      setLoading(false);
    }
  };

  const getFilters = () => {
    const filters = {
      page: pagination.current,
      page_size: pagination.pageSize,
    };

    const { company_name, company_tags, state, amount } = form.getFieldsValue();

    if (company_name) filters["name"] = company_name;
    if (company_tags && company_tags.length != 0)
      filters["transaction_tags"] = company_tags;
    if (state) filters["counties"] = getCountiesFromState(state);
    if (amount) filters["amount"] = amount;

    console.log("Filters: ", filters);
    return filters;
  };

  const getCountiesFromState = (state) => {
    const stateObject = STATES.find((stateObj) => stateObj.value === state);

    const counties = stateObject.children.map((countyObj) => countyObj.value);
    console.log("Counties: ", counties);
    return counties;
  };

  const handleFormSubmit = () => {
    const values = form.getFieldsValue();
    console.log("Form Values: ", values);

    getCompanies();
  };

  return (
    <Card>
      <Form
        initialValues={{ state: STATES[0].value }}
        onFinish={handleFormSubmit}
        size="middle"
        name="company_search"
        form={form}
        layout="vertical"
        disabled={loading}
      >
        <Filters />
        <Table
          size={TABLE_SIZE}
          pagination={pagination}
          className="no-border-last"
          rowKey="id"
          columns={columns}
          loading={loading}
          dataSource={companies}
          scroll={{ x: TABLE_WIDTH, y: TABLE_HEIGHT }}
          onChange={handleTableChange}
        />
      </Form>
    </Card>
  );
};

export default DefaultDashboard;
