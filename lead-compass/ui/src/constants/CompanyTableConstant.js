import { Tag } from "antd";

export const TABLE_HEIGHT = 550;
export const TABLE_WIDTH = 600;
export const TABLE_SIZE = "middle";


export  const columns = [
    {
      title: 'Id',
      key: 'id',
      dataIndex: 'id',
      width: '10%',
      fixed: 'left'
    },
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
      render: (text) => <a>{text.toUpperCase()}</a>,
    },
    {
      title: 'Address',
      key: 'address',
      dataIndex: 'principal_address',
      render: (address) => {
        return (address == null)? <span> -- </span> : <span>{address}</span>
      }
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
        title: 'Average Mortgage Amount',
        className: 'column-money',
        key: 'amount',
        dataIndex: 'average_mortgage_amount',
        render: (amount) => (
            (amount == null)? `$ ${0}` : `$ ${amount}`
        ),
        fixed: 'right'
      },
];