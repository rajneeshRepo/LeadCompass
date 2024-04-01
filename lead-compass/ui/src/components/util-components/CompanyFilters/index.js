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
import { TAGS, STATES } from "./CompanyFiltersData";

const Filters = ({ children }) => {
  return (
    <Row
      justify={{ xxl: "space-between", xs: "start" }}
      align="middle"
    >
      <Col xs={24} xxl={18}>
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
                {TAGS.map((tag) => (
                  <Select.Option key={tag} value={tag}>
                    {tag.replaceAll("_", " ").toUpperCase()}
                  </Select.Option>
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
              <Select
                showSearch
                placeholder="Please Select"
                maxTagCount="responsive"
                labelInValue
              >
                {STATES.map((state) => (
                  <Select.Option key={state["value"]} value={state["label"]}>
                    {state["label"]}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} xl={6} xxl={6}>
            <Form.Item label="Average Mortgage Amount">
              <Space.Compact block>
                <Form.Item name={["amount", "min_value"]} noStyle>
                  <InputNumber
                    type="number"
                    style={{
                      width: "50%",
                    }}
                    placeholder="Min value"
                  />
                </Form.Item>
                <Form.Item name={["amount", "max_value"]} noStyle>
                  <InputNumber
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
      <Col xs={24} xxl={6}>
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
