import { useState, useEffect, FC } from 'react';
//importing components
//importing material-ui
import DrawerRight from './DrawerRight';
import IconButton from '@mui/material/IconButton';
import Zoom from '@mui/material/Zoom';
import Avatar from '@mui/material/Avatar';
//importing material-ui-icons
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import GroupIcon from '@mui/icons-material/Group';
//importing styles
import './DrawerRightInfo.css';
import { Message } from '../types';

type Props = {
  drawerRightInfo: boolean;
  setDrawerRightInfo?: (open: boolean) => void;
  messages: Message[];
};

const DrawerRightInfo: FC<Props> = ({
  drawerRightInfo,
  setDrawerRightInfo,
  messages,
}) => {
  const [search, setSearch] = useState('');
  const [isFoundMessage, setIsFoundMessage] = useState(false);

  const findMessage = function (myMessages: string) {
    return function (x: Message) {
      var searchMessage = x.message + '' + x.caption;
      return (
        searchMessage.toLowerCase().includes(myMessages.toLowerCase()) ||
        !myMessages
      );
    };
  };

  useEffect(() => {
    const messageResult = () => {
      return (
        <>
          {messages.filter(findMessage(search)).map((message) => (
            <p key={message.id}>
              {message.message}
              {message.caption}
            </p>
          ))}
        </>
      );
    };

    if (search) {
      var result = messageResult();
      // console.log("result", result.props.children)
      if (result.props.children.length > 0) {
        setIsFoundMessage(true);
        console.log('search message sucess');
      } else {
        setIsFoundMessage(false);
        console.log('search message fail');
      }
    }
  }, [search, messages]);

  const handleDrawerClose = () => {
    setDrawerRightInfo?.(false);
  };

  return (
    <div>
      <DrawerRight
        drawerRight={drawerRightInfo}
        content={
          <>
            <div className="drawer-right-info__header">
              <IconButton onClick={handleDrawerClose}>
                <CloseIcon />
              </IconButton>
              <p>Group Info</p>
            </div>
            <div className="drawer-right-info-content">
              <div className="drawer-right-info-content__photo">
                <div className="profilePhoto">
                  <Zoom
                    in={drawerRightInfo}
                    style={{
                      transitionDelay: drawerRightInfo ? '300ms' : '0ms',
                    }}
                  >
                    {/* {photo ? (
                      <Avatar
                        src={photo}
                        className="profilePhoto__layer_bottom"
                      />
                    ) : (
                      <Avatar />
                    )} */}
                    {/* <Avatar /> */}
                    <Avatar>
                      <GroupIcon />
                    </Avatar>
                  </Zoom>
                  <div
                    className="profilePhoto__layer_top"
                    // onClick={handleProfileMenu}
                  >
                    <div className="profilePhoto__text">
                      <PhotoCameraIcon />
                      <p>CHANGE</p>
                      <p>PROFILE PHOTO</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
      />
    </div>
  );
};

export default DrawerRightInfo;
