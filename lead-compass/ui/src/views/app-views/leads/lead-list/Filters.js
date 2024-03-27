import React from "react";
import {
  Form,
  Col,
  Row,
  Space,
  Button,
  DatePicker,
  InputNumber,
} from "antd";
import dayjs from 'dayjs';

import { SearchOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const Filters = ({ children }) => {
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
                <label >Last Mortgage Date</label>
              }
              name="last_mortgage_date"
            >
              <RangePicker format={"YYYY/MM/DD"} />
            </Form.Item>
          </Col>

          <Col xs={24} xl={6} xxl={6}>
            <Form.Item
              label={
                <label >
                  Last Transaction Date
                </label>
              }
              name="last_transaction_date"
            >
              <RangePicker />
            </Form.Item>
          </Col>
          <Col xs={24} xl={6} xxl={6}>
            <Form.Item label="Average Mortgage Amount">
              <Space.Compact block>
                <Form.Item name={["average_mortgage_amount", "min_value"]} noStyle>
                  <InputNumber
                    min={0}
                    type="number"
                    style={{
                      width: "50%",
                    }}
                    placeholder="Min value"
                  />
                </Form.Item>
                <Form.Item name={["average_mortgage_amount", "max_value"]} noStyle>
                  <InputNumber
                    min={0}
                    type="number"
                    style={{
                      width: "50%",
                    }}
                    placeholder="Max value"
                  />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          </Col>
          <Col xs={24} xl={6} xxl={6}>
            <Form.Item label="Mortgage Transactions">
              <Space.Compact block>
                <Form.Item name={["mortgage_transactions", "min_value"]} noStyle>
                  <InputNumber
                    min={0}
                    type="number"
                    style={{
                      width: "50%",
                    }}
                    placeholder="Min value"
                  />
                </Form.Item>
                <Form.Item name={["mortgage_transactions", "max_value"]} noStyle>
                  <InputNumber
                    min={0}
                    type="number"
                    style={{
                      width: "50%",
                    }}
                    placeholder="Max value"
                  />
                </Form.Item>
              </Space.Compact>
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
