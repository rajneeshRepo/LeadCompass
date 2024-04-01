import React from "react"
import { Button } from "antd";
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const EmptyData = ({onClick, message, buttonText, buttonLink}) => {
    const theme = useSelector(state => state.theme.currentTheme)
	return (
		<div>
            <div className="container">
                <div className="text-center mb-5">
                    <img width="30%" src="/img/others/img-21.png" alt="" />
                    <h1 className="font-weight-bold mb-4">{message}</h1>
                        <Button onClick={onClick} type="primary">{buttonText}</Button>
                </div>
            </div>
			
		</div>
	)
}

export default EmptyData