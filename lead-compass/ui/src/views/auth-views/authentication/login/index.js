import React from 'react'
import LoginForm from '../../components/LoginForm'
import { Card, Row, Col } from "antd";
import { useSelector } from 'react-redux';

const backgroundStyle = {
	backgroundImage: 'url(/img/others/img-17.jpg)',
	backgroundRepeat: 'no-repeat',
	backgroundSize: 'cover'
}

const Login = props => {
	const theme = useSelector(state => state.theme.currentTheme)
	return (
		<div className={`h-100 ${theme === 'light' ? 'bg-white' : ''}`}>
			<Row justify="center" className="align-items-stretch h-100">
				<Col xs={20} sm={20} md={24} lg={16}>
					<div className="container d-flex flex-column justify-content-center h-100">
						<Row justify="center">
							<Col xs={24} sm={24} md={20} lg={12} xl={8}>
								<h1>Sign In</h1>
								{/* <p>Don't have an account yet? <a href="/auth/register-2">Sign Up</a></p> */}
								<div className="mt-4">
									<LoginForm {...props}/>
								</div>
							</Col>
						</Row>
					</div>
				</Col>
				<Col xs={0} sm={0} md={0} lg={8}>
					<div className="d-flex flex-column justify-content-between h-100 px-4" style={backgroundStyle}>
						<div className="text-right pt-4">
							<img src="/img/logo-white.png" alt="logo"/>
						</div>
						<Row justify="center">
							<Col xs={0} sm={0} md={0} lg={20}>
								<img className="img-fluid mb-5" src="/img/others/img-18.png" alt=""/>
								<h1 className="text-white">Welcome to lead compass</h1>
								<p className="text-white">Lead Compass is the go-to app for lenders, banks, and real estate professionals seeking their ideal customers. With our user-friendly platform, you can effortlessly navigate the vast world of real estate leads, ensuring you always stay on course to success.</p>
							</Col>
						</Row>
						<div className="d-flex justify-content-end pb-4">
							<div>
								<a className="text-white" href="/#" onClick={e => e.preventDefault()}>Term & Conditions</a>
								<span className="mx-2 text-white"> | </span>
								<a className="text-white" href="/#" onClick={e => e.preventDefault()}>Privacy & Policy</a>
							</div>
						</div>
					</div>
				</Col>
			</Row>
		</div>
	)
}

export default Login
