import React, {useEffect, useState} from 'react';
import { Table, Image,Spin } from 'antd';
import ApiService from 'services/ApiService';


const columns = [
  {
    title: 'NAME',
    dataIndex: 'full_name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: 'Total Organizations',
    dataIndex: 'total_orgs',
    key: 'total_orgs',
  },
  {
    title: 'Today\'s Organizations',
    dataIndex: 'today_orgs',
    key: 'today_orgs',
  },
];

const Report = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async() => {
    const data = await ApiService.harryBackendApi('api/admin/user_org_info','get',null, null);
    console.log(data,"org");
    setDataSource(data);
    setLoading(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Team's Report</h1>
        {/* <Image
          width={100}
          src="https://via.placeholder.com/150"
        /> */}
      </div>
      <div style={{ marginTop: 20 }}>
      {loading ? <Spin /> : <Table dataSource={dataSource} columns={columns} pagination={false} />}
      </div>
    </div>
  );
};

export default Report;
