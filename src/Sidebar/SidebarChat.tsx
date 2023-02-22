import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import VideocamIcon from '@mui/icons-material/Videocam';
import db from '../firebase';
import './SidebarChat.css';

type Props = {
  id: string;
  name: string;
};

const SidebarChat: FC<Props> = ({ id, name }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (id) {
      db.collection('rooms')
        .doc(id)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [id]);

  return (
    <Link to={`/rooms/${id}`} className="sidebarChat__link">
      <div className="sidebarChat">
        <Avatar>{name[0]}</Avatar>
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          {messages[0]?.photo ? (
            <div className="sideChat__photo">
              <PhotoCameraIcon /> <span>Photo</span>
            </div>
          ) : null}
          {messages[0]?.video ? (
            <div className="sideChat__photo">
              <VideocamIcon /> <span>Video</span>
            </div>
          ) : null}
          <p>{messages[0]?.message}</p>
          <p>{messages[0]?.url}</p>
        </div>
      </div>
    </Link>
  );
};

export default SidebarChat;
