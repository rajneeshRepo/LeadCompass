import React from "react";
import {
  Form,
  Input,
  Select,
  Col,
  Row,
  Button,
  Space,
  InputNumber,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { CompanyTags, STATES, companies } from "./DefaultDashboardData";

const { Option } = Select;

const Filters = ({ showSubmit }) => {
  const publish = () => {
    // publishData();
  };

  return (
    <Row
      gutter={8}
      justify={{ xxl: "space-between", xs: "start" }}
      align="middle"
    >
      <Col xs={24} xxl={20}>
        <Row gutter={24}>
          <Col xs={24} xl={6} xxl={6}>
            <Form.Item label="Company Name" name="company_name">
              <Input placeholder="Company Name" />
            </Form.Item>
          </Col>

          <Col xs={24} xl={6} xxl={6}>
            <Form.Item label="Company Tag" name="company_tags">
              <Select
                mode="multiple"
                placeholder="Please Select"
                maxTagCount="responsive"
              >
                {CompanyTags.map((tag) => (
                  <Option key={tag} value={tag}>
                    {tag.replaceAll("_", " ").toUpperCase()}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} xl={6} xxl={6}>
            <Form.Item
              rules={[{ required: true, message: "Please select state" }]}
              label="State"
              name="state"
            >
              <Select placeholder="Please Select" maxTagCount="responsive">
                {STATES.map((state) => (
                  <Option key={state["value"]} value={state["value"]}>
                    {state["label"]}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} xl={6} xxl={6}>
            <Form.Item label="Transaction Amount">
              <Space.Compact block>
                <Form.Item name={["amount", "min_value"]} noStyle>
                  <InputNumber
                    min={0}
                    type="number"
                    style={{
                      width: "50%",
                    }}
                    placeholder="Min value"
                  />
                </Form.Item>
                <Form.Item name={["amount", "max_value"]} noStyle>
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
          <Col></Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Filters;
