import {
  ChangeEventHandler,
  FC,
  MouseEventHandler,
  useEffect,
  useState,
} from 'react';
import { useStateValue } from '../StateProvider';
//importing components
import DropdownMenu from '../shared/DropdownMenu';
import { toastInfo } from '../shared/toastInfo';
import DialogCustom from '../shared/DialogCustom';
//importing material-ui
import Zoom from '@mui/material/Zoom';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
//importing material-ui-icons
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
//importing styles
import './DrawerLeft.css';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../firebase';

type Props = {
  drawerLeft: boolean;
  setDrawerLeft?: (open: boolean) => void;
};

const DrawerLeft: FC<Props> = ({ drawerLeft, setDrawerLeft }) => {
  const [{ user }] = useStateValue();
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [showEditName, setShowEditName] = useState(false);
  const [showEditAbout, setShowEditAbout] = useState(false);
  const [showProfilePhoto, setShowProfilePhoto] = useState(false);
  const [uploadPhotoLink, setUploadPhotoLink] = useState<string | null>(null);
  const [showDialogUpload, setShowDialogUpload] = useState(false);
  const [menuProfile, setMenuProfile] = useState<Element | null>(null);
  const [photo, setPhoto] = useState('');

  useEffect(() => {
    setName(user?.displayName || '');

    if (user?.uid) {
      const userRef = doc(db, 'users', user?.uid);

      getDoc(userRef).then((snap) => {
        const user = snap.data();
        setPhoto(user?.photoURL || '');
        setAbout(user?.about || '');
      });
    }
  }, [user?.uid, user?.displayName, db]);

  const updateName: MouseEventHandler<SVGSVGElement> = (e) => {
    e.preventDefault();

    if (user?.uid) {
      const userRef = doc(db, 'users', user?.uid);

      updateDoc(userRef, {
        name,
      });

      if (auth.currentUser) {
        updateProfile(auth.currentUser, {
          displayName: name,
        });
      }
    }
    setShowEditName(false);
  };

  const updateAbout: MouseEventHandler<SVGSVGElement> = (e) => {
    e.preventDefault();

    if (user?.uid) {
      const userRef = doc(db, 'users', user?.uid);

      updateDoc(userRef, {
        about,
      });
    }
    setShowEditAbout(false);
  };

  const editName = () => {
    setShowEditName(true);
  };

  const editAbout = () => {
    setShowEditAbout(true);
  };

  const handleDrawerClose = () => {
    setDrawerLeft?.(false);
    setShowEditName(false);
    setShowEditAbout(false);
  };

  const viewPhoto = () => {
    const viewPhoto = 'viewPhoto';

    if (user) {
      setShowProfilePhoto(true);
    } else {
      toastInfo('You have no photo!', viewPhoto, 'top-center');
    }
    setMenuProfile(null);
  };

  const viewPhotoClose = () => {
    setShowProfilePhoto(false);
  };

  const takePhoto = () => {
    const takePhoto = 'takePhoto';
    toastInfo('Take photo is not yet available!', takePhoto, 'top-center');
  };

  const removedPhoto = () => {
    const removedPhoto = 'removedPhoto';
    toastInfo(
      'Removed photo is not yet available!',
      removedPhoto,
      'top-center'
    );
  };

  const onFileChangeImage: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const imageFileSizeToastId = 'imageFileSizeToastId';
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toastInfo(
          'Image should not exceed more than 3Mb',
          imageFileSizeToastId,
          'top-center'
        );
      } else {
        const storageRef = ref(storage);
        if (user?.isAnonymous === true) {
          const imagesRef = ref(storageRef, `user/anonymous/${user?.uid}`);
          const fileRef = ref(imagesRef, file.name);
          await uploadBytes(fileRef, file);

          setUploadPhotoLink(await getDownloadURL(fileRef));
        } else {
          const imagesRef = ref(storageRef, `user/regular/${user?.uid}`);
          const fileRef = ref(imagesRef, file.name);
          await uploadBytes(fileRef, file);

          setUploadPhotoLink(await getDownloadURL(fileRef));
          console.log('uploading image', uploadPhotoLink);
        }
      }
      setMenuProfile(null);
      setShowDialogUpload(true);
    }
  };

  const uploadPhoto = () => {
    return (
      <div className="profileMenu_uploadPhoto">
        <label htmlFor="file-input">Upload photo</label>
        <input
          id="file-input"
          type="file"
          onChange={onFileChangeImage}
          accept="image/*"
        />
      </div>
    );
  };

  const handleUploadPhoto = () => {
    const uploadPhotoError = 'uploadPhotoError';

    if (uploadPhotoLink) {
      if (auth.currentUser && user?.uid) {
        updateProfile(auth.currentUser, {
          photoURL: uploadPhotoLink,
        });

        const userRef = doc(db, 'users', user?.uid);
        setDoc(userRef, { photoURL: uploadPhotoLink }, { merge: true });

        setShowDialogUpload(false);
      }
    } else {
      toastInfo('Select photo to upload!', uploadPhotoError, 'top-center');
    }
  };

  const handleDialogUploadClose = () => {
    setShowDialogUpload(false);
  };

  const handleProfileMenu: MouseEventHandler<HTMLDivElement> = (event) => {
    setMenuProfile(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setMenuProfile(null);
  };

  const menuLists = [
    {
      title: 'View Photo',
      onClick: () => viewPhoto(),
      id: Math.random() * 100000,
    },
    {
      title: 'Take photo',
      onClick: () => takePhoto(),
      id: Math.random() * 100000,
    },
    {
      title: uploadPhoto(),
      onClick: () => handleUploadPhoto(),
      id: Math.random() * 100000,
    },
    {
      title: 'Removed photo',
      onClick: () => removedPhoto(),
      id: Math.random() * 100000,
    },
  ];

  return (
    <div>
      <Drawer
        anchor="left"
        variant="persistent"
        open={drawerLeft}
        sx={{ position: 'absolute' }}
      >
        <div className="drawerLeft__header">
          <div className="drawerLeft__header_container">
            <IconButton onClick={handleDrawerClose}>
              <ArrowBackIcon />
            </IconButton>
            <p>Profile</p>
          </div>
        </div>

        <div className="drawerLeft__content">
          <div className="drawerLeft__content_photo">
            <div className="profilePhoto">
              <Zoom
                in={drawerLeft}
                style={{ transitionDelay: drawerLeft ? '300ms' : '0ms' }}
              >
                {photo ? (
                  <Avatar src={photo} className="profilePhoto__layer_bottom" />
                ) : (
                  <Avatar />
                )}
              </Zoom>
              <div
                className="profilePhoto__layer_top"
                onClick={handleProfileMenu}
              >
                <div className="profilePhoto__text">
                  <PhotoCameraIcon />
                  <p>CHANGE</p>
                  <p>PROFILE PHOTO</p>
                </div>
              </div>
            </div>

            <DropdownMenu
              menuLists={menuLists}
              menu={menuProfile}
              handleMenuClose={handleProfileMenuClose}
            />

            <DialogCustom
              open={showProfilePhoto}
              close={viewPhotoClose}
              photo={photo}
              user={user}
            />
          </div>

          <div className="profileMenu__diaglog">
            <Dialog
              open={showDialogUpload}
              onClose={handleDialogUploadClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title-drawerLeft">
                Upload Photo
              </DialogTitle>
              <DialogContent id="form-dialog-content">
                <div className="profileMenu__uploadPhoto_dialog">
                  <img src={uploadPhotoLink || undefined} alt="" />
                </div>
              </DialogContent>
              <DialogActions>
                <div className="profileMenu_uploadPhoto_iconButton">
                  <IconButton onClick={handleUploadPhoto}>
                    <CheckIcon />
                  </IconButton>
                </div>
              </DialogActions>
            </Dialog>
          </div>

          <div className="drawerLeft__content_name">
            <p>Your Name</p>
            <form>
              {showEditName ? (
                <>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    style={{ borderBottom: '1px solid green !important' }}
                  />
                  <CheckIcon onClick={updateName} />
                </>
              ) : (
                <>
                  <span>{name}</span>
                  <EditIcon onClick={editName} />
                </>
              )}
            </form>
          </div>

          <div className="drawerLeft__note">
            <span>
              This is not your username or pin. This name will be visible to
              your WhatsApp contacts.
            </span>
          </div>

          <div className="drawerLeft__content_name">
            <p>About</p>
            <form>
              {showEditAbout ? (
                <>
                  <input
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    type="text"
                  />
                  <CheckIcon onClick={updateAbout} />
                </>
              ) : (
                <>
                  <span>{about}</span>
                  <EditIcon onClick={editAbout} />
                </>
              )}
            </form>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default DrawerLeft;
