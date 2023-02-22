import { FC, MouseEventHandler, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStateValue } from '../StateProvider';
import ReactPlayer from 'react-player';
//importing material-ui
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
//importing material-ui-icons
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
//importing styles
import './DrawerBottom.css';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//   },
//   drawerPaper: {
//     position: 'absolute',
//     width: '100%',
//   },
//   paperAnchorBottom: {
//     left: 'auto',
//     right: 0,
//     bottom: 0,
//     maxHeight: '100%',
//     [theme.breakpoints.up('xs')]: {
//       top: 52,
//     },
//     [theme.breakpoints.up('sm')]: {
//       top: 65,
//     },
//     [theme.breakpoints.up('md')]: {
//       top: 65,
//     },
//     [theme.breakpoints.up('lg')]: {
//       top: 65,
//     },
//   },
// }));

type Props = {
  drawerBottom: boolean;
  setDrawerBottom?: (open: boolean) => void;
  fileImageUrl: string | null;
  fileVideoUrl: string | null;
  setFileVideoUrl?: (videoUrl: string | null) => void;
  setFileImageUrl?: (imageUrl: string | null) => void;
};

const DrawerBottom: FC<Props> = ({
  drawerBottom,
  setDrawerBottom,
  fileImageUrl,
  fileVideoUrl,
  setFileVideoUrl,
  setFileImageUrl,
}) => {
  // const classes = useStyles();
  const [{ user }] = useStateValue();
  const [caption, setCaption] = useState('');
  const { roomId } = useParams();

  const handleUpload: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (fileImageUrl) {
      const messagesRef = collection(db, 'rooms', roomId!, 'messages');

      addDoc(messagesRef, {
        photo: fileImageUrl,
        name: user?.displayName,
        uid: user?.uid,
        caption: caption,
        timestamp: serverTimestamp(),
      })
        .then((docRef) => {
          setDoc(
            doc(db, 'rooms', roomId!, 'messages', docRef.id),
            {
              id: docRef.id,
            },
            { merge: true }
          );
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
      setFileImageUrl?.(null);
    }
    if (fileVideoUrl) {
      const messagesRef = collection(db, 'rooms', roomId!, 'messages');

      addDoc(messagesRef, {
        video: fileVideoUrl,
        name: user?.displayName,
        uid: user?.uid,
        caption: caption,
        timestamp: serverTimestamp(),
      })
        .then((docRef) => {
          setDoc(
            doc(db, 'rooms', roomId!, 'messages', docRef.id),
            {
              id: docRef.id,
            },
            { merge: true }
          );
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
      setFileVideoUrl?.(null);
    }
    setCaption('');
    setDrawerBottom?.(false);
  };

  const handleDrawerClose: MouseEventHandler<HTMLButtonElement> = () => {
    setDrawerBottom?.(false);
  };

  return (
    <div>
      <Drawer
        variant="persistent"
        anchor="bottom"
        open={drawerBottom}
        // classes={{
        //   paper: classes.drawerPaper,
        //   paperAnchorBottom: classes.paperAnchorBottom,
        // }}
      >
        <div className="drawerBottom__header">
          <div className="drawerBottom__header_container">
            <IconButton onClick={handleDrawerClose}>
              <CloseIcon />
            </IconButton>
            <p>Preview</p>
          </div>
        </div>

        <div className="drawerBottom__content">
          <div className="drawerBottom__content_photo">
            {fileImageUrl ? (
              <img src={fileImageUrl} alt="" />
            ) : (
              <div className="drawerBottom__content_video">
                <div className="player-wrapper">
                  <ReactPlayer
                    className="react-player"
                    width="100%"
                    height="50%"
                    url={fileVideoUrl || undefined}
                    controls={true}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="drawerBottom__content_caption">
            <input
              type="text"
              placeholder="Add a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <Fab
              color="primary"
              aria-label="send"
              size="large"
              onClick={handleUpload}
            >
              <div className="chat__icon">
                <SendIcon />
              </div>
            </Fab>
          </div>
        </div>

        <div className="drawerBottom__footer">
          <div>{fileImageUrl ? <img src={fileImageUrl} alt="" /> : null}</div>
        </div>
      </Drawer>
    </div>
  );
};

export default DrawerBottom;
