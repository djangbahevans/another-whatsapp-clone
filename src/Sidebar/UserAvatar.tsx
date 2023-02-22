import Avatar from '@mui/material/Avatar';
import { FC } from 'react';

type Props = {
  photoURL: string;
  onClick(): void;
};

const UserAvatar: FC<Props> = ({ photoURL, onClick }) => {
  return (
    <div style={{ cursor: 'pointer' }}>
      <Avatar src={photoURL} onClick={onClick} />
    </div>
  );
};

export default UserAvatar;
