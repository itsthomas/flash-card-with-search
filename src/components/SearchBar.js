function SearchBar({ handleSearchInput }) {
  return (
    <input
      className='search-bar-input'
      type='text'
      placeholder='Search here...'
      onChange={handleSearchInput}
    />
  )
}

export default SearchBar
