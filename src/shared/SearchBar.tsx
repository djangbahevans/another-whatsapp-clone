import { FC, useState } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './SearchBar.css';

type Props = {
  placeholder: string;
  setSearch?: (value: string) => void;
  search: string;
};

const SearchBar: FC<Props> = ({ placeholder, setSearch, search }) => {
  const [showArrowIcon, setShowArrowIcon] = useState(false);

  const displaySearchIcon = () => {
    setShowArrowIcon(false);
  };

  const displayArrowIcon = () => {
    setShowArrowIcon(true);
  };

  return (
    <div
      className={`search ${showArrowIcon === true && 'search__bgColorChange'}`}
    >
      <div className="search__container">
        <span className={`${showArrowIcon === true ? 'arroww' : ''}`}>
          {showArrowIcon ? <ArrowForwardIcon /> : <SearchOutlinedIcon />}
        </span>
        <input
          value={search}
          onChange={(e) => setSearch?.(e.target.value)}
          type="text"
          placeholder={placeholder}
          required
          onFocus={displayArrowIcon}
          onBlur={displaySearchIcon}
        />
      </div>
    </div>
  );
};

export default SearchBar;
