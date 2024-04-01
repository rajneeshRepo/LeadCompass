import React from 'react'
import LoginForm from '../../components/LoginForm'
import { Row, Col } from "antd";
import { useSelector } from 'react-redux';

const backgroundURL = '/img/others/img-17.jpg'
// const backgroundStyle = {
// 	// backgroundImage: `url(${backgroundURL})`,
// 	// backgroundRepeat: 'no-repeat',
// 	// backgroundSize: 'cover'
// 	// back
// }
	const backgroundStyle = {
		background: '#F8F9FA'
	}


const Login = props => {
	const theme = useSelector(state => state.theme.currentTheme)

	return (
		<div className={`h-100 ${theme === 'light' ? 'bg-white' : ''}`}>
			<Row justify="center" className="align-items-stretch h-100">
				<Col xs={20} sm={20} md={24} lg={16}>
					<div className="container d-flex flex-column justify-content-center h-100">
						<Row justify="center">
							<Col xs={24} sm={24} md={20} lg={12} xl={8} style={{textAlign:"center"}}>
								<h1 style={{marginBottom:"0px"}}>Sign In</h1>
								<div className="mt-2">
									<LoginForm {...props}/>
								</div>
							</Col>
						</Row>
					</div>
				</Col>
				<Col xs={0} sm={0} md={0} lg={8}>
					<div className="d-flex flex-column justify-content-between h-100 px-4" style={backgroundStyle}>
						<Row justify="center" style={{marginTop:"350px"}}>
							<Col xs={0} sm={0} md={0} lg={20}>
								<img className="img-fluid mb-5" src="/img/others/login-image.png" alt="" style={{ display: 'block', margin: '0 auto' }}/>
							</Col>
						</Row>
					</div>
				</Col>
			</Row>
		</div>
	)
}

export default Login