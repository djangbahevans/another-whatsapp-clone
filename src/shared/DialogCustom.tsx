// import ReactPlayer from 'react-player';
//importing material-ui
import Zoom from '@mui/material/Zoom';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
//importing material-ui-icons
import CloseIcon from '@mui/icons-material/Close';
//importing styles
import './DialogCustom.css';

function DialogCustom({ open, close, user, photo }) {
  return (
    <Dialog
      open={open}
      fullScreen
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title-dialogCustom">
        <div>
          <Avatar src={user.photoURL} />
        </div>
        <div>
          <IconButton
            edge="end"
            color="inherit"
            onClick={close}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <Zoom in={open} style={{ transitionDelay: open ? '300ms' : '0ms' }}>
          <img src={photo} alt="" className="DialogCustom__photo" />
        </Zoom>
      </DialogContent>
    </Dialog>
  );
}

export default DialogCustom;
