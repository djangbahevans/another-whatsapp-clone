import { FC, MouseEventHandler, useState } from 'react';
import TooltipCustom from '../shared/TooltipCustom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ChatIcon from '@mui/icons-material/Chat';
import { db } from '../firebase';
import {
  addDoc,
  collection,
  serverTimestamp,
  setDoc,
  doc,
} from 'firebase/firestore';
import { User } from 'firebase/auth';

type Props = {
  user: User | null;
};

const NewChat: FC<Props> = ({ user }) => {
  const [roomName, setRoomName] = useState('');
  const [open, setOpen] = useState(false);

  const handleNewChatOpen = () => {
    setOpen(true);
  };

  const handleNewChatClose = () => {
    setOpen(false);
    setRoomName('');
  };

  const createChat: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    if (roomName) {
      const roomsRef = collection(db, 'rooms');

      addDoc(roomsRef, {
        roomOwner: user?.uid,
        createdBy: user?.displayName,
        name: roomName,
        timestamp: serverTimestamp(),
      }).then((docRef) => {
        setDoc(
          doc(db, 'rooms', docRef.id),
          {
            id: docRef.id,
          },
          { merge: true }
        );
      });
    }
    setOpen(false);
    setRoomName('');
  };

  return (
    <div>
      <TooltipCustom
        name="New Chat"
        onClick={() => handleNewChatOpen()}
        icon={<ChatIcon />}
      />

      <Dialog
        open={open}
        onClose={handleNewChatClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create Chat Room</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Room Name"
            type="text"
            fullWidth
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewChatClose} color="primary">
            Cancel
          </Button>
          <Button onClick={createChat} color="primary" disabled={!roomName}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewChat;
