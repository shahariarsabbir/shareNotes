import { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = 'Search notes by title, subject, or tag...' }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
        />
        {value && (
          <button type="button" className="search-clear" onClick={handleClear}>✕</button>
        )}
      </div>
      <button type="submit" className="search-submit">Search</button>
    </form>
  );
};

export default SearchBar;
