import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { FC, MouseEventHandler, ReactNode } from 'react';

type Props = {
  name: string;
  icon: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const TooltipCustom: FC<Props> = ({ name, icon, onClick }) => {
  return (
    <div>
      <Tooltip
        title={
          <span style={{ fontSize: '14px', padding: '8px 5px 8px 5px' }}>
            {name}
          </span>
        }
        placement="bottom-end"
      >
        <IconButton onClick={onClick}>{icon}</IconButton>
      </Tooltip>
    </div>
  );
};

export default TooltipCustom;
