import { useState, useEffect } from 'react';
//importing components
import SearchBar from '../shared/SearchBar';
//importing material-ui
import DrawerRight from './DrawerRight';
import IconButton from '@mui/material/IconButton';
import Zoom from '@mui/material/Zoom';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { makeStyles } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
//importing material-ui-icons
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import GroupIcon from '@mui/icons-material/Group';
//importing styles
import './DrawerRightInfo.css';

function DrawerRightInfo({
  drawerRightInfo,
  setDrawerRightInfo,
  messages,
  user,
}) {
  const [search, setSearch] = useState('');
  const [isFoundMessage, setIsFoundMessage] = useState(false);

  const findMessage = function (myMessages) {
    return function (x) {
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
    setDrawerRightInfo(false);
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
}

export default DrawerRightInfo;
