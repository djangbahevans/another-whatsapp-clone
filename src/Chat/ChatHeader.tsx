import { FC, MouseEventHandler, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStateValue } from '../StateProvider';
//importing components
import DropdownMenu from '../shared/DropdownMenu';
import DrawerRightSearch from './DrawerRightSearch';
import DrawerRightInfo from './DrawerRightInfo';
import TooltipCustom from '../shared/TooltipCustom';
import { toastInfo } from '../shared/toastInfo';
//importing material-ui
import Hidden from '@mui/material/Hidden';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
//importing material-ui-icons
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
//importing styles
import './ChatHeader.css';
import { Message } from '../types';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

type Props = {
  roomCreatedBy: string;
  roomOwner: string;
  roomName: string;
  roomId: string;
  _roomId: string;
  messages: Message[];
  isRoomExist: string | number;
};

const ChatHeader: FC<Props> = ({
  roomCreatedBy,
  roomOwner,
  roomName,
  roomId,
  _roomId,
  messages,
  isRoomExist,
}) => {
  const [{ user }] = useStateValue();
  const [drawerRightSearch, setDrawerRightSearch] = useState(false);
  const [drawerRightInfo, setDrawerRightInfo] = useState(false);
  const [menuChat, setMenuChat] = useState<Element | null>(null);
  const [role, setRole] = useState('');
  const [showDate, setShowDate] = useState(false);
  const [isLastMessage, setIsLastMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const errorAbout = 'errorAbout';
    if (user?.uid) {
      const userRef = doc(db, 'users', user.uid);

      getDoc(userRef)
        .then((doc) => {
          if (doc.exists()) {
            setRole(doc.data().role);
          }
        })
        .catch(function (error) {
          toastInfo(`${error}`, errorAbout, 'top-center');
        });
    }

    if (messages[messages.length - 1]?.timestamp) {
      setShowDate(true);
    } else {
      setShowDate(false);
    }

    if (messages[messages.length - 1]) {
      setIsLastMessage(true);
    } else {
      setIsLastMessage(false);
    }

    //listens when room is changed, then it closes DrawerRight
    if (isRoomExist >= 0) {
      setDrawerRightInfo(false);
      setDrawerRightSearch(false);
    }
  }, [user?.uid, user?.displayName, user?.isAnonymous, db, messages, roomId]);

  console.log('ROOOM ID', roomId);
  console.log('__ROOOM ID', _roomId);

  const getDateFromMessage = () => {
    return new Date(
      messages[messages.length - 1]?.timestamp?.toDate()
    ).toLocaleTimeString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      hour12: true,
      minute: 'numeric',
    });
  };

  const getDateLocal = () => {
    return new Date().toLocaleTimeString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      hour12: true,
      minute: 'numeric',
    });
  };

  const searchMessage = () => {
    setDrawerRightSearch(true);
  };

  const contactInfo = () => {
    setDrawerRightInfo(true);
    setMenuChat(null);
  };

  const selectMessages = () => {
    const selectMessages = 'selectMessages';
    toastInfo(
      'Select Messages is not yet  available!',
      selectMessages,
      'top-center'
    );
  };

  const muteNotifications = () => {
    const muteNotifications = 'muteNotifications';
    toastInfo(
      'Mute Notifications is not yet available!',
      muteNotifications,
      'top-center'
    );
  };

  const clearMessages = () => {
    const clearMessages = 'clearMessages';
    toastInfo(
      'Clear Messages is not yet available!',
      clearMessages,
      'top-center'
    );
  };

  const deleteRoom = () => {
    const roomDeleted = 'roomDeleted';

    if (roomOwner === user?.uid || role === 'admin') {
      const roomRef = doc(db, 'rooms', roomId);

      deleteDoc(roomRef)
        .then(() => {
          toastInfo('Room successfully deleted!', roomDeleted, 'top-center');
        })
        .catch((error) => {
          toastInfo(`Error removing room! ${error}`, roomDeleted, 'top-center');
        });
      navigate('/');
    } else {
      toastInfo(
        `You are not allowed to delete room ${roomName}. Only the admin or room owner ${roomCreatedBy}`,
        roomDeleted,
        'top-center'
      );
    }
  };

  const handleMenuClose = () => {
    setMenuChat(null);
  };

  const handleMenuOpen: MouseEventHandler<HTMLButtonElement> = (event) => {
    setMenuChat(event.currentTarget);
  };

  const menuChatLists = [
    {
      title: 'Contact info',
      onClick: () => contactInfo(),
      id: Math.random() * 100000,
    },
    {
      title: 'Select messages',
      onClick: () => selectMessages(),
      id: Math.random() * 100000,
    },
    {
      title: 'Mute notifications',
      onClick: () => muteNotifications(),
      id: Math.random() * 100000,
    },
    {
      title: 'Clear messages',
      onClick: () => clearMessages(),
      id: Math.random() * 100000,
    },
    {
      title: 'Delete Room',
      onClick: () => deleteRoom(),
      id: Math.random() * 100000,
    },
  ];

  return (
    <div className="chat__header">
      <DrawerRightSearch
        drawerRightSearch={drawerRightSearch}
        setDrawerRightSearch={setDrawerRightSearch}
        messages={messages}
        user={user}
      />

      <DrawerRightInfo
        drawerRightInfo={drawerRightInfo}
        setDrawerRightInfo={setDrawerRightInfo}
        messages={messages}
      />

      <Hidden smUp>
        <Link to="/">
          <div className="chat__back_button">
            <IconButton>
              <ArrowBackIcon />
            </IconButton>
          </div>
        </Link>
      </Hidden>

      <Avatar>{roomName[0]}</Avatar>
      <div className="chat__headerInfo">
        <h3>{roomName}</h3>
        <Hidden only={['xs']}>
          {isLastMessage ? (
            <>
              {showDate ? (
                <p>Last seen {getDateFromMessage()}</p>
              ) : (
                <p>Last seen {getDateLocal()}</p>
              )}
            </>
          ) : null}
        </Hidden>
      </div>

      <div className="chat__headerRight">
        <TooltipCustom
          name="Search"
          icon={<SearchOutlinedIcon />}
          onClick={searchMessage}
        />
        <TooltipCustom
          name="Menu"
          icon={<MoreVertIcon />}
          onClick={handleMenuOpen}
        />
        <DropdownMenu
          menuLists={menuChatLists}
          menu={menuChat}
          // handleMenuOpen={handleMenuOpen}
          handleMenuClose={handleMenuClose}
        />
      </div>
    </div>
  );
};

export default ChatHeader;
