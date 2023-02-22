import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FC, MouseEventHandler } from 'react';

type Props = {
  handleMenuClose?: (
    event: {},
    reason: 'backdropClick' | 'escapeKeyDown'
  ) => void;
  menuLists: {
    id: number;
    onClick: MouseEventHandler<HTMLLIElement>;
    title: string | JSX.Element;
  }[];
  menu?: Element | ((element: Element) => Element) | null | undefined;
};

const DropdownMenu: FC<Props> = ({ menuLists, menu, handleMenuClose }) => {
  return (
    <div>
      <Menu
        id="simple-menu"
        anchorEl={menu}
        keepMounted
        open={Boolean(menu)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        // getContentAnchorEl={null}
      >
        {menuLists.map((menuList) => (
          <MenuItem key={menuList.id} onClick={menuList.onClick}>
            {menuList.title}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default DropdownMenu;
