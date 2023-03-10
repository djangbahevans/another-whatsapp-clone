import { useState, useEffect, FC } from 'react';
//importing components
import SearchBar from '../shared/SearchBar';
//importing material-ui
import DrawerRight from './DrawerRight';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
//importing material-ui-icons
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
//importing styles
import './DrawerRightSearch.css';
import { Message } from '../types';
import { User } from 'firebase/auth';

type Props = {
  drawerRightSearch: boolean;
  setDrawerRightSearch: (open: boolean) => void;
  messages: Message[];
  user: User | null;
};

const DrawerRightSearch: FC<Props> = ({
  drawerRightSearch,
  setDrawerRightSearch,
  messages,
  user,
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
    setDrawerRightSearch(false);
  };

  return (
    <div>
      <DrawerRight
        drawerRight={drawerRightSearch}
        content={
          <>
            <div className="drawerRight__header">
              <IconButton onClick={handleDrawerClose}>
                <CloseIcon />
              </IconButton>
              <p>Search Messages</p>
            </div>

            <SearchBar
              search={search}
              setSearch={setSearch}
              placeholder="Search..."
            />

            <div
              className={`drawerRight__content ${
                isFoundMessage === true &&
                search.length > 0 &&
                'drawerRight__content_searched'
              }`}
            >
              {search.length > 0 ? (
                <>
                  {isFoundMessage ? (
                    <>
                      {messages.filter(findMessage(search)).map((message) => (
                        <div
                          key={message.id}
                          className="drawerRight__content_searched_message"
                        >
                          <p>
                            {new Date(
                              message.timestamp?.toDate()
                            ).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              hour12: true,
                              minute: 'numeric',
                            })}
                            <br />
                          </p>
                          <p id="last_p">
                            {message.uid === user?.uid ? <DoneIcon /> : null}
                            {message.message}
                            {message.caption}
                          </p>
                          <Divider />
                        </div>
                      ))}
                    </>
                  ) : (
                    <p>No message found</p>
                  )}
                </>
              ) : (
                <p>Search for messages in this room.</p>
              )}
            </div>
          </>
        }
      />
    </div>
  );
};

export default DrawerRightSearch;
