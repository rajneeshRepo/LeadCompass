import React, { useState, useEffect } from "react";
import { Table, Form, Card, Tag, message } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';

import Filters from "./Filters";

import {
  TABLE_HEIGHT,
  TABLE_WIDTH,
  TABLE_SIZE,
} from "constants/CompanyTableConstant";
import LeadService from "services/LeadService";

const dateFormat = 'YYYY-MM-DD';

export const LeadList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState([]);

  const navigate = useNavigate();

  const [pagination, setTablePagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    form.validateFields().then(() => getLeads());
  }, [pagination.current, pagination.pageSize]);

  const handleTableChange = (pagination) => {
    setTablePagination(pagination);
  };

  const getLeads = async () => {
    setLoading(true);

    const filters = getFilters();

    try {
      const response = await LeadService.leads(filters);
      if (response.leads) setLeads(response.leads);
      if (response.leads_total_count) {
        setTablePagination({
          ...pagination,
          total: response.leads_total_count,
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

    const {
      last_mortgage_date,
      last_transaction_date,
      average_mortgage_amount,
      mortgage_transactions,
    } = form.getFieldsValue();

    console.log(form.getFieldsValue());

    if (last_mortgage_date) {
      const startDate = last_mortgage_date[0].format("YYYY-MM-DD");
      const endDate = last_mortgage_date[1].format("YYYY-MM-DD");
      filters["last_mortgage_date"] = {
        start_date: startDate,
        end_date: endDate,
      };
    }

    if (last_transaction_date) {
      const startDate = last_transaction_date[0].format("YYYY-MM-DD");
      const endDate = last_transaction_date[1].format("YYYY-MM-DD");

      filters["last_transaction_date"] = {
        start_date: startDate,
        end_date: endDate,
      };
    }

    if (average_mortgage_amount) {
      console.log(average_mortgage_amount);
      filters["average_mortgage_amount"] = average_mortgage_amount
    }

    if (mortgage_transactions) {
      filters["mortgage_transactions"] = mortgage_transactions
    }

    console.log("Filters: ", filters);
    return filters;
  };

  const getCountiesFromState = (state) => {
    // const stateObject = STATES.find((stateObj) => stateObj.value === state);
    // const counties = stateObject.children.map((countyObj) => countyObj.value);
    // console.log("Counties: ", counties);
    // return counties;
  };

  const handleFormSubmit = () => {
    const values = form.getFieldsValue();
    console.log("Form Values: ", values);

    getLeads();
  };

  const viewDetails = (row) => {
    console.log("Came Here");
    navigate(`/app/leads/view-lead/${row.id}`);
  };

  const columns = [
    {
      title: "Id",
      key: "id",
      dataIndex: "id",
      width: "10%",
      fixed: 'left'
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (_, elm) => (
        <a onClick={() => viewDetails(elm)}>{elm["name"].toUpperCase()}</a>
      ),
    },
    {
      title: "Address",
      key: "address",
      dataIndex: "principal_address",
      render: (address) => {
        return address == null ? <span> -- </span> : <span>{address}</span>;
      },
    },
    {
      title: 'Tags',
      key: 'tags',
      width: '35%',
      dataIndex: 'tag_names',
      render: (tag_names) => (
        <div className="p-2">
          {tag_names.map((tag) => {
            let color = tag.length > 7 ? 'geekblue' : 'green';
            if (tag === 'borrower') {
              color = 'volcano';
            }
            return (
              <Tag className='my-1' color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </div>
      ),
    },
    {
      title: "Average Mortgage Amount",
      className: "column-money",
      key: "amount",
      dataIndex: "average_mortgage_amount",
      render: (amount) => (amount == null ? `$ ${0}` : `$ ${amount}`),
      fixed: 'right'
    },
  ];

  return (
    <Card>
      <Form
        // initialValues={{"last_transaction_date": [dayjs('2023-11-01', dateFormat), dayjs('2023-12-29', dateFormat)]}}
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
          dataSource={leads}
          scroll={{ x: TABLE_WIDTH, y: TABLE_HEIGHT }}
          onChange={handleTableChange}
        />
      </Form>
    </Card>
  );
};

export default LeadList;
