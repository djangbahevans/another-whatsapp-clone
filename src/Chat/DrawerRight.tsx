//importing material-ui
import Drawer from '@mui/material/Drawer';
import { FC, ReactNode } from 'react';
//importing styles
import './DrawerRight.css';

type Props = {
  content: ReactNode;
  drawerRight: boolean;
};

const DrawerRight: FC<Props> = ({ content, drawerRight }) => {
  return (
    <div>
      <Drawer
        anchor="right"
        variant="persistent"
        open={drawerRight}
        sx={{ xs: { width: '100vw' } }}
      >
        {content}
      </Drawer>
    </div>
  );
};

export default DrawerRight;
