import React, {useState, useEffect} from "react";
import {
  Form,
  Col,
  Row,
  Space,
  Button,
  DatePicker,
  InputNumber,
  Input,
  Select
} from "antd";
import dayjs from 'dayjs';

import { SearchOutlined } from "@ant-design/icons";
import UserService from "services/UserService";

const { RangePicker } = DatePicker;

const STATUS = [
  {
    label: "Bronze",
    value: "bronze"
  },
  {
    label: "Silver",
    value: "silver"
  },
  {
    label: "Gold",
    value: "gold"
  }
]

const Filters = ({ children }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, [])

  const getUsers = async () => {
    try{
      const response = await UserService.users();
      const users = response.users;
      setUsers(users);
    }catch(error){
      console.log("Something went wrong");
    }
	}

  return (
    <Row
      gutter={8}
      justify={{ xxl: "space-between", xs: "start" }}
      align="middle"
    >
      <Col xs={24} xxl={20}>
        <Row gutter={24}>
          <Col xs={24} xl={6} xxl={6}>
            <Form.Item
              label={
                <label>File Name</label>
              }
              name="file_name"
            >
              <Input placeholder="search"/>
            </Form.Item>
          </Col>

          <Col xs={24} xl={6} xxl={6}>
            <Form.Item
              label={
                <label >
                  User
                </label>
              }
              name="user"
            >
              <Select labelInValue showSearch placeholder="select">
              {users.map((user) => (
                  <Select.Option key={user.id} value={user.name}>
                    {user.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} xl={6} xxl={6}>
            <Form.Item label="Status" name="status">
              <Select placeholder="select">
              {STATUS.map((status) => (
                  <Select.Option key={status["value"]} value={status["value"]}>
                    {status["label"]}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} xl={6} xxl={6}>
            <Form.Item
                label={
                  <label >Created At</label>
                }
                name="createdAt"
              >
                <RangePicker format={"YYYY/MM/DD"} />
            </Form.Item>
          </Col>
        </Row>
      </Col>
      <Col xs={24} xxl={4}>
        <Row gutter={24} justify={{ xxl: "space-evenly", xs: "start" }}>
          <Col>
            <Form.Item className="mt-4">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
              >
                Search
              </Button>
            </Form.Item>
          </Col>
          <Col>{children}</Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Filters;
