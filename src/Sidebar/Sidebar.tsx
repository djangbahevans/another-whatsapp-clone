import { useState, useEffect, FC, MouseEventHandler } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStateValue } from '../StateProvider';
//importing firebase;
import { auth } from '../firebase';
//importing components
import UserAvatar from './UserAvatar';
import NewChat from './NewChat';
import Status from './Status';
import DropdownMenu from '../shared/DropdownMenu';
import DrawerLeft from './DrawerLeft';
import SearchBar from '../shared/SearchBar';
import SidebarChat from './SidebarChat';
import { toastInfo } from '../shared/toastInfo';
import TooltipCustom from '../shared/TooltipCustom';
//importing material-ui
import CircularProgress from '@mui/material/CircularProgress';
import MoreVertIcon from '@mui/icons-material/MoreVert';
//importing styles
import './Sidebar.css';
import { Room } from '../types';

type Props = {
  isRoomExist: string | number;
  setIsRoomExist?(data: string | number): void;
  rooms: Room[];
};

const Sidebar: FC<Props> = ({ rooms, setIsRoomExist, isRoomExist }) => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [{ user }] = useStateValue();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [noRooms, setNoRooms] = useState(false);
  const [drawerLeft, setDrawerLeft] = useState(false);
  const [menuSidebar, setMenuSidebar] = useState<Element | null>(null);
  const [isSearchFound, setIsSetSearchFound] = useState(false);

  const findRoom = function (myRooms: string) {
    return function (x: Room) {
      var searchRoom = x.data.name + '';
      return (
        searchRoom.toLowerCase().includes(myRooms.toLowerCase()) || !myRooms
      );
    };
  };

  useEffect(() => {
    const roomResult = () => {
      return (
        <>
          {rooms.filter(findRoom(search)).map((room) => (
            <p key={room.id}>{room.name}</p>
          ))}
        </>
      );
    };

    if (search) {
      var result = roomResult();
      // console.log("result", result)
      if (result.props.children.length > 0) {
        setIsSetSearchFound(true);
        // console.log("search sucess");
      } else {
        setIsSetSearchFound(false);
        // console.log("search fail");
      }
    }

    //checks if room exists, else will be redirect to landing screen
    var roomList = rooms;
    if (roomList) {
      //checks if the current route(roomId) exists in roomList(array)
      const index = roomList.findIndex(function (id, index) {
        return id.id === roomId;
      });

      if (index >= 0) {
        setIsRoomExist?.(index);
        // console.log("ROOM EXISTS");
      } else if (index === -1) {
        setIsRoomExist?.(index);
        navigate('/');
        // console.log("ROOM DOES NOT EXIST");
      }
    }
  }, [search, rooms, roomId, navigate, setIsRoomExist]);

  useEffect(() => {
    if (rooms) {
      if (rooms.length > 0) {
        setNoRooms(false);
        setLoading(true);
      } else if (rooms.length === 0 && isRoomExist === -1) {
        setNoRooms(true);
        setLoading(true);
      }
    }
  }, [rooms]);

  // console.log("ROOMS> >", noRooms);
  // console.log("ROOMS EXIST> >", isRoomExist);

  const handleDrawerLeftOpen = () => {
    setMenuSidebar(null);
    setDrawerLeft(true);
  };

  const handleMenuOpen: MouseEventHandler<HTMLButtonElement> = (event) => {
    setMenuSidebar(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuSidebar(null);
  };

  const archive = () => {
    const archive = 'archive';
    toastInfo('Archive is not yet available!', archive, 'top-center');
  };

  const starred = () => {
    const starred = 'starred';
    toastInfo('Starred is not yet available!', starred, 'top-center');
  };

  const settings = () => {
    const settings = 'settings';
    toastInfo('Settings is not yet available!', settings, 'top-center');
  };

  const logout = () => {
    if (user?.isAnonymous === true) {
      auth.currentUser
        ?.delete()
        .then(function () {
          navigate('/');
        })
        .catch(function (error) {
          // An error happened.
          console.log('error deleting anonymous user', error);
        });
    } else {
      auth.signOut();
    }
  };

  const menuLists = [
    {
      title: 'Profile',
      onClick: () => handleDrawerLeftOpen(),
      id: Math.random() * 100000,
    },
    {
      title: 'Archived',
      onClick: () => archive(),
      id: Math.random() * 100000,
    },
    {
      title: 'Starred',
      onClick: () => starred(),
      id: Math.random() * 100000,
    },
    {
      title: 'Settings',
      onClick: () => settings(),
      id: Math.random() * 100000,
    },
    {
      title: 'Logout',
      onClick: () => logout(),
      id: Math.random() * 100000,
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <UserAvatar
          // id="UserProfile"
          photoURL={user?.photoURL!}
          onClick={() => handleDrawerLeftOpen()}
        />
        <DrawerLeft drawerLeft={drawerLeft} setDrawerLeft={setDrawerLeft} />

        <div className="sidebar__headerRight">
          <Status />
          <NewChat user={user} />
          <TooltipCustom
            name="Menu"
            icon={<MoreVertIcon />}
            onClick={handleMenuOpen}
          />
          <DropdownMenu
            menuLists={menuLists}
            menu={menuSidebar}
            // handleMenuOpen={handleMenuOpen}
            handleMenuClose={handleMenuClose}
          />
        </div>
      </div>

      <SearchBar
        search={search}
        setSearch={setSearch}
        placeholder="Search or start new chat"
      />

      <div className="sidebar__chats">
        {loading ? (
          <>
            {search ? (
              <>
                {isSearchFound ? (
                  <div>
                    {rooms.filter(findRoom(search)).map((room) => (
                      <SidebarChat
                        key={room.id}
                        id={room.id}
                        name={room.data.name!}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="sidebar__chatsContainer_empty">
                    <span>No chat room found</span>
                  </div>
                )}
              </>
            ) : (
              <>
                {rooms.map((room) => (
                  <SidebarChat
                    key={room.id}
                    id={room.id}
                    name={room.data.name!}
                  />
                ))}
              </>
            )}
          </>
        ) : (
          <div className="sidebar__chatsContainer_loading">
            <div>
              <CircularProgress />
            </div>
          </div>
        )}

        {noRooms && loading ? (
          <div className="sidebar__chatsContainer_empty">
            <span>No chats</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Sidebar;
