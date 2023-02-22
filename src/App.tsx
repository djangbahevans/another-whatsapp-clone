import { useEffect, useState } from 'react';
import { useStateValue } from './StateProvider';
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from 'react-router-dom';
//importing firebase
import { auth, db } from './firebase';
//importing actions
import { setUser } from './actions/userAction';
//importing components
import Login from './Login';
import Sidebar from '../src/Sidebar/Sidebar';
import Chat from '../src/Chat/Chat';
import { ToastContainer } from 'react-toastify';
import { toastInfo } from './shared/toastInfo';
//importing material-ui
import Hidden from '@mui/material/Hidden';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
//importing styles
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { Room } from './types';
import { updateProfile } from 'firebase/auth';

function App() {
  const [{ user }, dispatch] = useStateValue();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isRoomExist, setIsRoomExist] = useState<string | number>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(setUser(authUser));
        setLoading(true);

        const roomsRef = collection(db, 'rooms');
        const q = query(roomsRef, orderBy('timestamp', 'desc'));

        getDocs(q).then((snap) => {
          setRooms(
            snap.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });

        if (authUser.isAnonymous === true && authUser.displayName === null) {
          var anonymousName =
            'Anonymous' + ' ' + Math.floor(Math.random() * 1000000);

          if (auth.currentUser)
            updateProfile(auth.currentUser, {
              displayName: anonymousName,
              photoURL: '',
            });

          const userRef = doc(db, 'users', authUser.uid);

          setDoc(userRef, {
            name: anonymousName,
            about: 'Hey there! I am using WhatsApp.',
            photoURL: '',
            role: 'anonymous',
            dateJoined: serverTimestamp(),
          });
        }

        if (
          authUser.uid &&
          authUser.isAnonymous === false &&
          authUser.photoURL !== null
        ) {
          const errorAbout = 'errorAbout';

          const userRef = doc(db, 'users', authUser.uid);

          getDoc(userRef)
            .then((doc) => {
              if (!doc.exists()) {
                setDoc(userRef, {
                  name: authUser.displayName,
                  about: 'Hey there! I am using WhatsApp.',
                  photoURL: user?.photoURL,
                  role: 'regular',
                  dateJoined: serverTimestamp(),
                });
              }
            })
            .catch((error) => {
              toastInfo(`${error}`, errorAbout, 'top-center');
            });
        } else if (
          authUser.uid &&
          authUser.isAnonymous === false &&
          authUser.photoURL === null
        ) {
          const errorAbout = 'errorAbout';

          const userRef = doc(db, 'users', authUser.uid);

          getDoc(userRef)
            .then((doc) => {
              if (!doc.exists()) {
                setDoc(userRef, {
                  name: authUser.displayName,
                  about: 'Hey there! I am using WhatsApp.',
                  photoURL: '',
                  role: 'regular',
                  dateJoined: serverTimestamp(),
                });
              }
            })
            .catch((error) => {
              toastInfo(`${error}`, errorAbout, 'top-center');
            });
        }
      } else {
        dispatch(setUser(null));
        setLoading(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch, user]);

  return (
    <div className={`app ${loading === false && 'app-no-bg'}`}>
      {loading ? (
        <>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
          />
          {!user ? (
            <Login />
          ) : (
            <div className="app__body">
              <Router>
                <Routes>
                  <Route path="/">
                    <Sidebar
                      rooms={rooms}
                      setIsRoomExist={setIsRoomExist}
                      isRoomExist={isRoomExist}
                    />
                    <Hidden only={['xs']}>
                      {' '}
                      {/* Chat component will be hidden in mobile view */}
                      <Chat isRoomExist={isRoomExist} />
                    </Hidden>
                  </Route>

                  <Route path="/rooms/:roomId">
                    <Hidden only={['xs']}>
                      {' '}
                      {/* Sidebar component will be hidden in mobile view */}
                      <Sidebar
                        rooms={rooms}
                        setIsRoomExist={setIsRoomExist}
                        isRoomExist={isRoomExist}
                      />
                    </Hidden>
                    <Chat isRoomExist={isRoomExist} />
                  </Route>

                  <Route path="*">
                    <Navigate to="/" />
                  </Route>
                </Routes>
              </Router>
            </div>
          )}
        </>
      ) : (
        <div className="app__loading">
          <div>
            <div className="app__loading_circular">
              <CircularProgress />
            </div>
            <div className="app__loading_linear">
              <LinearProgress />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
