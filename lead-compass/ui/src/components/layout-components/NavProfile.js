import React, { useEffect, useState } from "react";
import { Dropdown, Avatar } from "antd";
import { useDispatch } from "react-redux";
import { LogoutOutlined, UserAddOutlined, UnorderedListOutlined, SettingOutlined} from "@ant-design/icons";
import styled from "@emotion/styled";

import {
  FONT_WEIGHT,
  MEDIA_QUERIES,
  SPACER,
  FONT_SIZES,
} from "constants/ThemeConstant";
import Flex from "components/shared-components/Flex";
import { signOut } from "store/slices/authSlice";
import AuthService from "services/AuthService";
import utils from "utils";
import NavItem from "./NavItem";
import { useNavigate } from "react-router-dom";

const Icon = styled.div(() => ({
  fontSize: FONT_SIZES.LG,
}));

const Profile = styled.div(() => ({
  display: "flex",
  alignItems: "center",
}));

const UserInfo = styled("div")`
  padding-left: ${SPACER[2]};

  @media ${MEDIA_QUERIES.MOBILE} {
    display: none;
  }
`;

const Name = styled.div(() => ({
  fontWeight: FONT_WEIGHT.SEMIBOLD,
}));

const Title = styled.span(() => ({
  opacity: 0.8,
}));

const MenuItemSignOut = (props) => {
  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <div onClick={handleSignOut}>
      <Flex alignItems="center" gap={SPACER[2]}>
        <Icon>
          <LogoutOutlined />
        </Icon>
        <span>{props.label}</span>
      </Flex>
    </div>
  );
};

const MenuItemAddUser = (props) => {
  const navigate = useNavigate();

  return <div onClick={() => navigate(`/app/users/add`)}>
      <Flex alignItems="center" gap={SPACER[2]}>
        <Icon>
          <UserAddOutlined />
        </Icon>
        <span>{props.label}</span>
      </Flex>
    </div>
};

const MenuItemUsersList = (props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/app/users/list');
  }

  return <div onClick={handleClick}>
      <Flex alignItems="center" gap={SPACER[2]}>
        <Icon>
          <UnorderedListOutlined />
        </Icon>
        <span>{props.label}</span>
      </Flex>
    </div>
};

const MenuItemSettings = (props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/app/user/setting');
  }

  return <div onClick={handleClick}>
      <Flex alignItems="center" gap={SPACER[2]}>
        <Icon>
          <SettingOutlined />
        </Icon>
        <span>{props.label}</span>
      </Flex>
    </div>
}

export const NavProfile = ({ mode }) => {
  const [user, setUser] = useState({
    name: "",
    role: "",
  });

  const [items, setItems] = useState([
    {
      key: "Settings",
      label: <MenuItemSettings label="Settings" />
    },
    {
      key: "Sign Out",
      label: <MenuItemSignOut label="Sign Out" />,
    },
    {
      key: "Add User",
      label: <MenuItemAddUser label="Add User" />
    },
    {
      key: "Users List",
      label: <MenuItemUsersList label="Users List" />
    }
  ])

  const getCurrentUser = async () => {
    const response = await AuthService.userDetails();
    setUser(response.user);
    if(response.user.role != "admin") setItems([items[0]]);
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <Dropdown placement="bottomRight" menu={{ items }} trigger={["click"]}>
      <NavItem mode={mode}>
        <Profile>
          <Avatar style={{ backgroundColor: "#1B77D7" }}>
            {utils.getNameInitial(user.name)}
          </Avatar>
          <UserInfo className="profile-text">
            <Name className="text-capitalize">{user.name}</Name>
            <Title className="text-capitalize">{user.role}</Title>
          </UserInfo>
        </Profile>
      </NavItem>
    </Dropdown>
  );
};

export default NavProfile;
