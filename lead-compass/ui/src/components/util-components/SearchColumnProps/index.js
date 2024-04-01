import {
  Select,
  Input,
  DatePicker,
  Button,
  Flex,
  Space,
  InputNumber,
  Form,
} from "antd";
import { SearchOutlined, CalendarOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;

// Search Text
export const getColumnSearchProps = ({ key, placeholder, filteredInfo }) => ({
  filteredValue: filteredInfo[key] || null,
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
    close,
  }) => {
    return (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          placeholder={placeholder}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            confirm(false);
          }}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Flex justify="end">
          <Button
            className="mt-2"
            disabled={!selectedKeys[0]}
            onClick={() => {
              setSelectedKeys([]);
              confirm();
            }}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Flex>
      </div>
    );
  },
  filterIcon: (filtered) => (
    <SearchOutlined
      style={{
        color: filtered ? "#1677ff" : undefined,
      }}
    />
  ),
});

// Select Option
export const getColumnSelectProps = ({
  key,
  placeholder,
  filteredInfo,
  mode, // multiple, single
  dropdownProp: { options, optionKey, optionLabel },
}) => ({
  filteredValue: filteredInfo[key] || null,
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
    close,
  }) => {
    return (
      <div
        style={{
          padding: 8,
          width: "200px",
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Select
          mode={mode}
          placeholder={placeholder}
          value={selectedKeys ? selectedKeys : null}
          optionFilterProp={optionLabel}
          options={options}
          fieldNames={{ label: optionLabel, value: optionKey }}
          onChange={(e) => {
            console.log(e);
            setSelectedKeys(mode && mode == "multiple" ? e : [e]);
            confirm();
          }}
          style={{
            display: "block",
          }}
          showSearch
        />
        <Flex justify="end">
          <Button
            className="mt-2"
            disabled={!selectedKeys[0]}
            onClick={() => {
              setSelectedKeys([]);
              confirm();
            }}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Flex>
      </div>
    );
  },
  filterIcon: (filtered) => {
    return (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    );
  },
});

// Search Range
export const getRangeProps = ({ key, filteredInfo }) => ({
  filteredValue: filteredInfo[key] || null,
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
    close,
  }) => {
    return (
      <div
        style={{
          padding: 8,
          width: "250px",
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Form
          fields={[
            {
              name: ["value"],
              value: selectedKeys[0],
            },
          ]}
          onValuesChange={(currValue, allValues) => {
            setSelectedKeys(
              allValues.value.min_value || allValues.value.max_value
                ? [allValues.value]
                : []
            );
            confirm(false);
          }}
        >
          <Space.Compact block>
            <Form.Item name={["value", "min_value"]} noStyle>
              <InputNumber
                type="number"
                style={{
                  width: "50%",
                }}
                placeholder="Min value"
              />
            </Form.Item>
            <Form.Item name={["value", "max_value"]} noStyle>
              <InputNumber
                type="number"
                style={{
                  width: "50%",
                }}
                placeholder="Max value"
              />
            </Form.Item>
          </Space.Compact>
        </Form>
        <Flex justify="end">
          <Button
            className="mt-2"
            disabled={!selectedKeys[0]}
            onClick={() => {
              setSelectedKeys([]);
              confirm();
            }}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Flex>
      </div>
    );
  },
  filterIcon: (filtered) => {
    return (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    );
  },
});

// Search Date Range
export const getColumnDateRangeProps = ({ dataIndex, filteredInfo }) => ({
  filteredValue: filteredInfo[dataIndex] || null,
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
    close,
  }) => {
    return (
      <div
        style={{
          padding: 8,
          width: "230px",
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <RangePicker
          className="w-100"
          placeholder={["Start Date", "End Date"]}
          value={selectedKeys[0] ? selectedKeys[0] : null}
          format={"YYYY/MM/DD"}
          onChange={(e) => {
            setSelectedKeys(e ? [e] : []);
            confirm();
          }}
        />
        <Flex justify="end">
          <Button
            className="mt-2"
            disabled={!selectedKeys[0]}
            onClick={() => {
              setSelectedKeys([]);
              confirm();
            }}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Flex>
      </div>
    );
  },
  filterIcon: (filtered) => (
    <CalendarOutlined
      style={{
        color: filtered ? "#1677ff" : undefined,
      }}
    />
  ),
});
