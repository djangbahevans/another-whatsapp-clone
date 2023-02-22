import { FC, useEffect, useState } from 'react';
import { useStateValue } from '../StateProvider';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
//importing components
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import ChatLandingScreen from './ChatLandingScreen';
//importing material-ui
import CircularProgress from '@mui/material/CircularProgress';
//importing styles
import 'react-toastify/dist/ReactToastify.css';
import './Chat.css';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';
import { Message } from '../types';

type Props = {
  isRoomExist: string | number;
};

const Chat: FC<Props> = ({ isRoomExist }) => {
  const navigate = useNavigate();
  const [{ user }] = useStateValue();
  const { roomId } = useParams();
  const [_roomId, set_RoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomCreatedBy, setRoomCreatedBy] = useState('');
  const [roomOwner, setRoomOwner] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLandingScreenPhoto, setShowLandingScreenPhoto] = useState(false);

  useEffect(() => {
    if (roomId) {
      const roomRef = doc(db, 'rooms', roomId);
      getDoc(roomRef).then((snap) => {
        const room = snap.data();

        setRoomName(room?.name);
        setRoomCreatedBy(room?.createdBy);
        setRoomOwner(room?.roomOwner);
        set_RoomId(room?.id);
      });

      const messagesRef = collection(db, 'rooms', roomId, 'messages');

      const q = query(messagesRef, orderBy('name', 'asc'));

      getDocs(q).then((snap) => {
        setMessages(snap.docs.map((doc) => doc.data() as Message));
        setLoading(true);
      });

      setShowLandingScreenPhoto(false);
    } else {
      setShowLandingScreenPhoto(true);
      navigate('/');
    }
  }, [roomId, navigate]);

  return (
    <div className="chat">
      {roomId ? (
        <>
          <div>
            <ChatHeader
              roomCreatedBy={roomCreatedBy}
              roomOwner={roomOwner}
              roomName={roomName}
              roomId={roomId}
              _roomId={_roomId}
              messages={messages}
              isRoomExist={isRoomExist}
            />
          </div>

          <div className="chat__body">
            {loading ? (
              <ChatBody
                roomCreatedBy={roomCreatedBy}
                roomOwner={roomOwner}
                roomId={roomId}
                messages={messages}
                user={user}
                isRoomExist={isRoomExist}
              />
            ) : (
              <div className="chat__body_loading">
                <div>
                  <CircularProgress />
                </div>
              </div>
            )}
          </div>

          <div>
            <ChatFooter roomName={roomName} roomId={roomId} />
          </div>
        </>
      ) : (
        <ChatLandingScreen showLandingScreenPhoto={showLandingScreenPhoto} />
      )}
    </div>
  );
};

export default Chat;
