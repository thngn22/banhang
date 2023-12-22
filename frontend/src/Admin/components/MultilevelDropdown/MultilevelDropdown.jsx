import React from "react";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, message, Space, Tooltip } from "antd";
import { useSelector } from "react-redux";

const MultilevelDropdown = (props) => {
  const { onMenuItemClick } = props;

  const categories = useSelector(
    (state) => state.category.multilevelCate.currentCate
  );

  const renderSubMenu = (categories) => {
    return categories.map((category, index) => {
      if (category.categories && category.categories.length > 0) {
        return (
          <Menu.SubMenu key={category.id} title={category.name}>
            {renderMenu(category.categories)}
          </Menu.SubMenu>
        );
      } else {
        return (
          <Menu.Item key={category.id} title={category.name}>
            {category.name}
          </Menu.Item>
        );
      }
    });
  };

  const renderMenu = (categories) => {
    return categories.map((category) => {
      return (
        <Menu.Item
          key={category.id}
          title={category.name}
          onClick={() => handleMenuItemClick(category.id, category.name)}
        >
          {category.name}
        </Menu.Item>
      );
    });
  };
  const handleMenuItemClick = (key, title) => {
    onMenuItemClick(key, title);
  };
  const menu = <Menu>{renderSubMenu(categories)}</Menu>;

  return (
    <div>
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button>
          <span>Chọn Danh mục của sản phẩm</span> <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default MultilevelDropdown;
