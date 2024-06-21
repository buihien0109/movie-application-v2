import { Avatar, Dropdown, Flex, message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutApiMutation } from "../../app/services/auth2.service";
import { logout } from "../../app/slices/auth.slice";

function AppLayoutHeader() {
    const { auth } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [logoutApi, { isLoading }] = useLogoutApiMutation();

    const handleLogout = () => {
        logoutApi()
            .unwrap()
            .then((data) => {
                dispatch(logout());
                message.success("Đăng xuất thành công");
            })
            .catch((error) => {
                message.error(error.data.message);
            });
    };

    const items = [
        {
            key: "1",
            label: <a href="/">Quay lại trang chủ</a>,
        },
        {
            key: "2",
            label: <span onClick={handleLogout}>Đăng xuất</span>,
        },
    ];

    return (
        <Flex
            justify="flex-end"
            align="center"
            style={{ padding: "0 16px", height: "100%" }}
        >
            <Dropdown
                menu={{
                    items,
                }}
                placement="bottomLeft"
                trigger={["click"]}
                disabled={isLoading}
            >
                <Avatar
                    src={<img src={auth.avatar} alt="avatar" />}
                    size={40}
                />
            </Dropdown>
        </Flex>
    );
}

export default AppLayoutHeader;
