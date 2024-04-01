import React, {useState, useEffect} from 'react'
import { Card, Table, Select, Input, Button, Badge, Menu, Tag } from 'antd';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import { useNavigate } from "react-router-dom";
import utils from 'utils'
import UserService from 'services/UserService';

const { Option } = Select

const categories = ['Enabled', 'Disabled']

const UserList = () => {
	const navigate = useNavigate();
	const [users, setUsers] = useState([])
	const [filteredUsersList, setFilteredUsersList] = useState([]);

	useEffect(() => {
		getUsers()
	},[])

	const getUsers = async () => {
		const response = await UserService.users();
		const users = response.users;
		setUsers(users);
		setFilteredUsersList(users);
	}
	
	const addUser = () => {
		navigate(`/app/users/add`)
	}

	const tableColumns = [
		// {
		// 	title: 'ID',
		// 	dataIndex: 'id'
		// },
		{
			title: 'Name',
			dataIndex: 'name',
			render: (_, record) => (
				<div className="d-flex">
					{record.name}
				</div>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
		},
		{
			title: 'Status',
			dataIndex: 'status',
			className: 'text-capitalize'
		},
		// {
		// 	title: 'Price',
		// 	dataIndex: 'price',
		// 	render: price => (
		// 		<div>
		// 			<NumberFormat
		// 				displayType={'text'} 
		// 				value={(Math.round(price * 100) / 100).toFixed(2)} 
		// 				prefix={'$'} 
		// 				thousandSeparator={true} 
		// 			/>
		// 		</div>
		// 	),
		// 	sorter: (a, b) => utils.antdTableSorter(a, b, 'price')
		// },
		{
			title: 'Contact',
			dataIndex: 'phone',
			// sorter: (a, b) => utils.antdTableSorter(a, b, 'stock')
		},
		{
			title: 'Email',
			dataIndex: 'email',
			// sorter: (a, b) => utils.antdTableSorter(a, b, 'stock')
		},
		{
			title: 'Role',
			dataIndex: 'role',
			className: 'text-capitalize',
			render: (_, record) => (
				<div>
				  <Tag className="mr-0" color={record.role == 'admin'? 'cyan' : 'volcano'}>{record.role}</Tag>
				</div>
			),
		},
		{
			title: 'Verified',
			dataIndex: 'isAuthenticated',
			render: (_, record) => (
				<div>
				  <Tag className="mr-0" color={record.isAuthenticated ? 'cyan' : 'volcano'}>{record.isAuthenticated ? 'Verified' : 'Unverified'}</Tag>
				</div>
			),
		}
	];

	const onSearch = e => {
		const value = e.currentTarget.value
		const data = utils.wildCardSearch(users, value)
		setFilteredUsersList(data);
	}

	// const handleShowCategory = value => {
	// 	if(value !== 'All') {
	// 		const key = 'category'
	// 		const data = utils.filterArray(ProductListData, key, value)
	// 		setList(data)
	// 	} else {
	// 		setList(ProductListData)
	// 	}
	// }

	return (
		<Card>
			<Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
				<Flex className="mb-1" mobileFlex={false}>
					<div className="mr-md-3 mb-3">
						<Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)}/>
					</div>
					{/* <div className="mb-3">
						<Select 
							defaultValue="All" 
							className="w-100" 
							style={{ minWidth: 180 }} 
							onChange={handleShowCategory} 
							placeholder="Category"
						>
							<Option value="All">All</Option>
							{
								categories.map(elm => (
									<Option key={elm} value={elm}>{elm}</Option>
								))
							}
						</Select>
					</div> */}
				</Flex>
				<div>
					<Button onClick={addUser} type="primary" icon={<PlusCircleOutlined />} block>Add user</Button>
				</div>
			</Flex>
			<div className="table-responsive">
				<Table 
					columns={tableColumns} 
					dataSource={filteredUsersList} 
					rowKey='id' 
				/>
			</div>
		</Card>
	)
}

export default UserList
