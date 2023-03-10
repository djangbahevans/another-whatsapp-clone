import { ChangeEventHandler, FC, KeyboardEventHandler, useState } from 'react';
import { useStateValue } from '../StateProvider';
import { toastInfo } from '../shared/toastInfo';
//importing components
import DrawerBottom from './DrawerBottom';
import TooltipCustom from '../shared/TooltipCustom';
import Picker from '@emoji-mart/react';
//importing material-ui
import Hidden from '@mui/material/Hidden';
import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import Slide from '@mui/material/Slide';
import ClickAwayListener from '@mui/material/ClickAwayListener';
//importing material-ui-icons
import CloseIcon from '@mui/icons-material/Close';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PhotoIcon from '@mui/icons-material/Photo';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import PersonIcon from '@mui/icons-material/Person';
//importing styles
// import 'emoji-mart/css/emoji-mart.css';
import './ChatFooter.css';
import {
  addDoc,
  collection,
  serverTimestamp,
  setDoc,
  doc,
} from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const attachFileLists = [
  {
    title: 'Room',
    icon: <VideoCallIcon />,
    id: Math.random() * 100000,
  },
  {
    title: 'Contact',
    icon: <PersonIcon />,
    id: Math.random() * 100000,
  },
  {
    title: 'Document',
    icon: <InsertDriveFileIcon />,
    id: Math.random() * 100000,
  },
  {
    title: 'Camera',
    icon: <CameraAltIcon />,
    id: Math.random() * 100000,
  },
  {
    title: 'Photos & Videos',
    icon: <PhotoIcon />,
    id: Math.random() * 100000,
  },
];

type Props = {
  roomName: string;
  roomId: string;
};

const ChatFooter: FC<Props> = ({ roomName, roomId }) => {
  const [{ user }] = useStateValue();
  const [input, setInput] = useState('');
  const [emoji, setEmoji] = useState(false);
  const [fileImageUrl, setFileImageUrl] = useState<string | null>(null);
  const [fileVideoUrl, setFileVideoUrl] = useState<string | null>(null);
  const [drawerBottom, setDrawerBottom] = useState(false);
  const [showAttachFile, setShowAttachFile] = useState(false);

  const attachFile = () => {
    const attachToastId = 'attach';
    toastInfo(
      'All icons have the same functions, you can only upload images, gifs and videos!',
      attachToastId,
      'top-center'
    );
    if (showAttachFile === false) {
      setShowAttachFile(true);
    } else {
      setShowAttachFile(false);
    }
    // console.log("attachFile click", attachToastId);
  };

  const addEmoji = (e: any) => {
    let emoji = e.native;
    setInput(input + emoji);
  };

  const handleEmoticons = () => {
    setEmoji(true);
  };

  const handleEmoticonsClose = () => {
    setEmoji(false);
  };

  const voiceMessage = () => {
    const voiceMessageToastId = 'voiceMessage';
    toastInfo(
      'Voice Message is not yet available!',
      voiceMessageToastId,
      'top-center'
    );
  };

  const onFileChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const fileSizeToastId = 'fileSizeToastId';
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 12 * 1024 * 1024) {
      toastInfo(
        'File should not exceed more than 12MB',
        fileSizeToastId,
        'top-center'
      );
    } else {
      const storageRef = ref(storage);

      if (file.type.match('image.*')) {
        const imagesRef = ref(storageRef, `rooms/${roomName}/images/`);
        const fileRef = ref(imagesRef, new Date().getTime() + ' ' + file.name);
        await uploadBytes(fileRef, file);

        setFileImageUrl(await getDownloadURL(fileRef));
        console.log('uploading image', fileImageUrl);
      } else if (file.type.match('video.*')) {
        const videosRef = ref(storageRef, `rooms/${roomName}/videos`);
        const fileRef = ref(videosRef, new Date().getTime() + ' ' + file.name);
        await uploadBytes(fileRef, file);

        setFileVideoUrl(await getDownloadURL(fileRef));
        console.log('uploading video', fileVideoUrl);
      }
      setDrawerBottom(true);
    }
  };

  const handleClickAway = () => {
    setShowAttachFile(false);
  };

  const onEnterPress: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();

      const youtubeLink =
        /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
      const facebookVideoLink =
        /^https?:\/\/www\.facebook\.com.*\/(video(s)?|watch|story)(\.php?|\/).+$/;
      const vimeoLink =
        /(http|https)?:\/\/(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/;
      const soundcloudLink = /^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/;
      const dailymotionLink =
        /^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/;
      const urlLink =
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

      if (roomId) {
        if (
          youtubeLink.test(input) ||
          facebookVideoLink.test(input) ||
          vimeoLink.test(input) ||
          soundcloudLink.test(input) ||
          dailymotionLink.test(input)
        ) {
          const messagesRef = collection(db, 'rooms', roomId, 'messages');
          addDoc(messagesRef, {
            message: '',
            video: input,
            name: user?.displayName,
            uid: user?.uid,
            timestamp: serverTimestamp(),
          })
            .then((docRef) => {
              setDoc(
                doc(db, 'rooms', roomId, 'messages', docRef.id),
                {
                  id: docRef.id,
                },
                { merge: true }
              );
            })
            .catch((error) => {
              console.error('Error adding document: ', error);
            });
        } else if (urlLink.test(input)) {
          const messagesRef = collection(db, 'rooms', roomId, 'messages');
          addDoc(messagesRef, {
            message: '',
            url: input,
            name: user?.displayName,
            uid: user?.uid,
            timestamp: serverTimestamp(),
          })
            .then((docRef) => {
              setDoc(
                doc(db, 'rooms', roomId, 'messages', docRef.id),
                {
                  id: docRef.id,
                },
                { merge: true }
              );
            })
            .catch((error) => {
              console.error('Error adding document: ', error);
            });
        } else if (/\S/.test(input)) {
          const messagesRef = collection(db, 'rooms', roomId, 'messages');
          addDoc(messagesRef, {
            message: input,
            name: user?.displayName,
            uid: user?.uid,
            timestamp: serverTimestamp(),
          })
            .then((docRef) => {
              setDoc(
                doc(db, 'rooms', roomId, 'messages', docRef.id),
                {
                  id: docRef.id,
                },
                { merge: true }
              );
            })
            .catch((error) => {
              console.error('Error adding document: ', error);
            });
        }
      }
      setInput('');
      setEmoji(false);
    }
  };

  return (
    <div className="chat__footer">
      <DrawerBottom
        drawerBottom={drawerBottom}
        setDrawerBottom={setDrawerBottom}
        fileVideoUrl={fileVideoUrl}
        fileImageUrl={fileImageUrl}
        setFileImageUrl={setFileImageUrl}
        setFileVideoUrl={setFileVideoUrl}
      />

      {emoji ? (
        <Hidden only={['xs']}>
          <TooltipCustom
            name="Close"
            icon={<CloseIcon />}
            onClick={() => handleEmoticonsClose()}
          />
        </Hidden>
      ) : null}

      <TooltipCustom
        name="Emoticons"
        icon={<InsertEmoticonIcon />}
        onClick={() => handleEmoticons()}
      />

      {emoji ? (
        <>
          <Hidden only={['xs']}>
            <Picker onEmojiSelect={addEmoji} />
          </Hidden>
          <Hidden smUp>
            <ClickAwayListener onClickAway={handleEmoticonsClose}>
              <Picker onSelect={addEmoji} />
            </ClickAwayListener>
          </Hidden>
        </>
      ) : null}

      <div>
        <TooltipCustom
          name="Attach"
          icon={<AttachFileIcon />}
          onClick={attachFile}
        />
        {showAttachFile ? (
          <ClickAwayListener onClickAway={handleClickAway}>
            <div className="chat__attachFile">
              {attachFileLists.map((attachFileList) => (
                <Slide
                  key={attachFileList.id}
                  direction="up"
                  // in={attachFile}
                  mountOnEnter
                  unmountOnExit
                >
                  <Tooltip
                    title={
                      <span
                        style={{ fontSize: '14px', padding: '8px 5px 8px 5px' }}
                      >
                        {attachFileList.title}
                      </span>
                    }
                    placement="left"
                  >
                    <Fab color="primary" aria-label="person">
                      <div className="chat__icon">
                        <label htmlFor="file-input">
                          {attachFileList.icon}
                        </label>
                        <input
                          id="file-input"
                          type="file"
                          onChange={onFileChange}
                          accept="image/*,video/mp4,video/3gpp,video/quicktime"
                        />
                      </div>
                    </Fab>
                  </Tooltip>
                </Slide>
              ))}
            </div>
          </ClickAwayListener>
        ) : null}
      </div>

      <form>
        {/* <input
          required
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          type="text"
          // minLength="1"
          // maxLength="700"
        /> */}
        <textarea
          required
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          rows={1}
          onKeyDown={onEnterPress}
          // cols="50"
          // minLength="1"
          // maxLength="700"
        />

        {/* <TextField
          id="filled-full-width"
          fullWidth
          multiline
          rowsMax={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        /> */}

        {/* <button onClick={sendMessage} type="submit">
          Send a message
        </button> */}
      </form>

      <TooltipCustom
        name="Voice Message"
        icon={<MicIcon />}
        onClick={() => voiceMessage()}
      />
    </div>
  );
};

export default ChatFooter;
