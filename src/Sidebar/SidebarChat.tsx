import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import VideocamIcon from '@mui/icons-material/Videocam';
import './SidebarChat.css';
import { db } from '../firebase';
import { collection, doc, getDocs, orderBy, query } from 'firebase/firestore';
import { Message } from '../types';

type Props = {
  id: string;
  name: string;
};

const SidebarChat: FC<Props> = ({ id, name }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (id) {
      const messagesRef = collection(db, 'rooms', id, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'desc'));
      getDocs(q).then((snap) => {
        setMessages(snap.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
      });
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
