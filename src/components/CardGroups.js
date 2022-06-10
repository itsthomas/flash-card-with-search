/* eslint-disable */
import { useState, useEffect, useCallback } from 'react';
import uuid from 'react-uuid';
import debounce from 'lodash.debounce';
import { db } from '../firebase';
import FlipCardSwipe from './FlipCardSwipe';
import FlipCard from './FlipCard';
import AllFlipCards from './AllFlipCards';
import SearchBar from './SearchBar';

function CardGroups() {
  const [cards, setCards] = useState([]);
  const [totalDoclNumbers, setTotalDoclNumbers] = useState(0);
  const [startPoint, setStartPoint] = useState(-1);
  const [endPoint, setEndPoint] = useState(0);
  const [showFlipCardSwipe, setShowFlipCardSwipe] = useState(false);
  const [goThroughAllCards, setGoThroughAllCards] = useState(false);
  const [showAllFlipCard, setShowAllFlipCards] = useState(false);
  const [showCardGroups, setShowCardGroups] = useState(true);

  const [filteredCards, setFilteredCards] = useState([]);
  const [filtering, setFiltering] = useState(false);

  const docLimit = 10;

  useEffect(() => {
    // This first query is to fetch all cards from Collection
    const firstFetch = () => {
      db.collection('FlashCards')
        .orderBy('createdAt', 'asc')
        .get()
        .then((data) => {
          setTotalDoclNumbers(data.docs.length);

          // Save firebase db data in cards using the setCards method
          setCards(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
    };

    firstFetch();
  }, []);

  // Creating a number of cards
  // See https://stackoverflow.com/questions/62499420/react-cloud-firestore-how-can-i-add-pagination-to-this-component/62500027#62500027
  const RenderCardGroups = () =>
    Array(Math.ceil(totalDoclNumbers / docLimit))
      .fill()
      // The _ should be the name of the current element in a map() method
      // Since the current element in this case is undefined, and we don't do anything with it, it's
      // a good practice using an underscore
      // i is the index of the iteration. You don't need to declare it yourself, is provided by map.
      .map((_, i) => {
        let groupLength = docLimit;

        if (i === Math.ceil(totalDoclNumbers / docLimit) - 1) {
          groupLength = totalDoclNumbers - docLimit * i;
        }
        return (
          <div key={uuid()} className="scene-group scene-group--list visible">
            <div
              key={`card-group-${uuid()}`}
              className="card-group"
              onClick={() => {
                setStartPoint(docLimit * i);
                setEndPoint(docLimit * i + groupLength);
                setShowFlipCardSwipe(true);
                setShowCardGroups(false);
              }}
            >
              <div className="card__face card__face--front">
                {docLimit * i + 1} to {docLimit * i + groupLength}
              </div>
            </div>
          </div>
        );
      });

  const debounceFilter = useCallback(
    debounce((query) => {
      setFilteredCards(
        cards.filter(({ originalText, translatedText }) => {
          if (
            typeof originalText === 'string' &&
            typeof translatedText === 'string'
          )
            return (
              originalText.toLowerCase().includes(query.toLowerCase()) ||
              translatedText.toLowerCase().includes(query.toLowerCase())
            );
          return false;
        })
      );
    }, 500),
    [cards]
  );

  const handleSearchInput = (e) => {
    if (!filtering) {
      setFiltering(true);
      setShowCardGroups(false);
      setShowFlipCardSwipe(false);
      setShowAllFlipCards(false);
    }
    const query = e.target.value;
    if (!query) return setFilteredCards([]);

    debounceFilter(query);
  };

  return (
    <>
      <SearchBar handleSearchInput={handleSearchInput} />
      <div className="cards__nav">
        <button
          type="button"
          className={`cards__btn ${showCardGroups ? 'selected' : ''}`}
          onClick={() => {
            setShowCardGroups(true);
            setShowFlipCardSwipe(false);
            setShowAllFlipCards(false);
            setGoThroughAllCards(false);
            if (filtering) setFiltering(false);
          }}
        >
          Show all cards in groups
        </button>

        <button
          type="button"
          className={`cards__btn ${goThroughAllCards ? 'selected' : ''}`}
          onClick={() => {
            setShowCardGroups(false);
            setShowFlipCardSwipe(true);
            setGoThroughAllCards(true);
            setShowAllFlipCards(false);
            setStartPoint(0);
            setEndPoint(totalDoclNumbers);
            if (filtering) setFiltering(false);
          }}
        >
          Go through all cards
        </button>
        <button
          type="button"
          className={`cards__btn ${showAllFlipCard ? 'selected' : ''}`}
          onClick={() => {
            setShowCardGroups(false);
            setShowFlipCardSwipe(false);
            setShowAllFlipCards(true);
            setGoThroughAllCards(false);
            if (filtering) setFiltering(false);
          }}
        >
          Show all cards side by side
        </button>
      </div>

      {showCardGroups ? (
        <div className="cards__grid">
          <RenderCardGroups />
        </div>
      ) : showAllFlipCard ? (
        <div className="cards__grid">
          <AllFlipCards
            cards={cards}
            startPoint={startPoint}
            endPoint={endPoint}
          />
        </div>
      ) : showFlipCardSwipe ? (
        <div>
          <FlipCardSwipe
            cards={cards}
            startPoint={startPoint}
            endPoint={endPoint}
          />
        </div>
      ) : filtering ? (
        <FilteredCards cards={filteredCards} />
      ) : (
        <div>
          <FlipCardSwipe cards={cards} />
        </div>
      )}
    </>
  );
}

export default CardGroups;

function FilteredCards({ cards }) {
  return (
    <>
      {cards.length <= 0 && (
        <div style={{ textAlign: 'center', paddingTop: '3rem' }}>
          No cards found...
        </div>
      )}
      {cards.length === 1 && <FlipCard card={cards[0]} number={1} />}
      {cards.length > 1 && (
        <FlipCardSwipe cards={cards} startPoint={0} endPoint={cards.length} />
      )}
    </>
  );
}
