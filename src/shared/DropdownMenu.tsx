import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function DropdownMenu({ menuLists, menu, handleMenuClose }) {
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
        getContentAnchorEl={null}
      >
        {menuLists.map((menuList) => (
          <MenuItem key={menuList.id} onClick={menuList.onClick}>
            {menuList.title}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default DropdownMenu;
