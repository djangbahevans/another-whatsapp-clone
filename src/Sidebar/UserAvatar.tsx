import Avatar from '@mui/material/Avatar';
import { FC, MouseEventHandler } from 'react';

type Props = {
  photoURL?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

const UserAvatar: FC<Props> = ({ photoURL, onClick }) => {
  return (
    <div style={{ cursor: 'pointer' }}>
      <Avatar src={photoURL} onClick={onClick} />
    </div>
  );
};

export default UserAvatar;
