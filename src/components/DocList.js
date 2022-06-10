/* eslint-disable */
import { useState, useEffect, useCallback } from 'react';
import uuid from 'react-uuid';
import debounce from 'lodash.debounce';
import { db } from '../firebase';
import UpdateCard from './UpdateCard';
import AddCard from './AddCard';
import SearchBar from './SearchBar';
import DeleteCard from './DeleteCard';

function DocList() {
  const [cards, setCards] = useState([]);
  const [filtering, setFiltering] = useState(false);
  const [beginAfter, setBeginAfter] = useState(-1);
  const [addCardIsVisible, setAddCardVisibility] = useState(false);
  const [totalDoclNumbers, setTotalDoclNumbers] = useState(0);
  const [addButtonClickCount, setAddButtonClickCount] = useState(0);
  const docLimit = 10;

  const fetchData = async (query) => {
    // FlashCards is the name of our collection on FireBase server
    // .get all data from our FireBase collection and save them in to const data
    const flashCards = db.collection('FlashCards');

    flashCards.get().then((documentSnapshots) => {
      const totalDoclNumbers2 = documentSnapshots.docs.length;
      if (totalDoclNumbers2 > 0) {
        const numberOfPages = Math.ceil(totalDoclNumbers2 / docLimit);
        const maxIndex = numberOfPages > 0 ? numberOfPages - 1 : 0;

        let first = db.collection('FlashCards').orderBy('createdAt');

        if (beginAfter !== 0) {
          if (beginAfter !== -1) {
            first = first.limit(beginAfter);
          } else if (maxIndex !== 0) {
            first = first.limit(maxIndex * docLimit);
          }
        }

        first.get().then((data) => {
          // Get the last visible document
          const lastVisible = data.docs[data.docs.length - 1];
          // Construct a new query starting at this document,
          // get the next 25 cities.
          let next = db.collection('FlashCards').limit(docLimit);

          if (typeof query === 'string') {
            next = next
              .orderBy('originalText')
              .where('originalText', '>=', query)
              .where('originalText', '<=', query + '\uf8ff');
          } else {
            next = next.orderBy('createdAt');
            if (beginAfter !== 0 && maxIndex !== 0) {
              next = next.startAfter(lastVisible);
            }
          }

          next.get().then((snapshotsData) => {
            let data = snapshotsData.docs.map((doc) => {
              return {
                ...doc.data(),
                id: doc.id,
              };
            });
            if (typeof query === 'string') {
              if (data.length > 0) {
                setCards(data);
              } else {
                db.collection('FlashCards')
                  .limit(docLimit)
                  .orderBy('translatedText')
                  .where('translatedText', '>=', query)
                  .where('translatedText', '<=', query + '\uf8ff')
                  .get()
                  .then((newNextData) => {
                    setCards(
                      newNextData.docs.map((doc) => {
                        return {
                          ...doc.data(),
                          id: doc.id,
                        };
                      })
                    );
                  });
              }
            } else {
              setCards(data);
            }

            // Save firebase db data in cards using the setCards method
            setTotalDoclNumbers(totalDoclNumbers2);

            const i = totalDoclNumbers / docLimit;
            const lastBlock = docLimit * (i - 1);
            if (beginAfter >= lastBlock || beginAfter === -1) {
              setAddCardVisibility(true);
            } else {
              setAddCardVisibility(false);
            }
          });
        });
      } else {
        setAddCardVisibility(true);
      }
    });
  };
  useEffect(() => {
    fetchData();
  }, [beginAfter]);

  // Extra fetch to get updates results from the FireStore collection after deleting a doc
  // const _fetchData = async () => {
  //   db.collection('FlashCards')
  //     .orderBy('createdAt', 'asc') // or you could use 'desc'
  //     .limit(docLimit)
  //     .startAfter(beginAfter)
  //     .get()
  //     .then((data) => {
  //       // Save firebase db data in cards using the setCards method
  //       setCards(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  //     })
  // }

  // Adding a 0 before single digit number such as 1, 2, 3, etc.
  const doubleDigit = (d) => (d < 10 ? `0${d.toString()}` : d.toString());
  // Creating a pagination menu for our documents (100 documents per each menu)
  // See https://stackoverflow.com/questions/62499420/react-cloud-firestore-how-can-i-add-pagination-to-this-component/62500027#62500027
  const RenderDocumentMenu = () =>
    Array(Math.ceil(totalDoclNumbers / docLimit))
      .fill()
      // The _ should be the name of the current element in a map() method
      // Since the current element in this case is undefined, and we don't do anything with it, it's
      // a good practice using an underscore
      // i is the index of the iteration. You don't need to declare it yourself, is provided by map.
      .map((_, i) => {
        const onClick = () => {
          setBeginAfter(docLimit * i);
          setFiltering(false);
        };

        const documentMenuIsSelected =
          beginAfter === docLimit * i ||
          (beginAfter === -1 &&
            i === Math.ceil(totalDoclNumbers / docLimit) - 1);

        return (
          <div
            key={uuid()}
            className={
              documentMenuIsSelected ? 'nav__set selected' : 'nav__set'
            }
            onClick={onClick}
          >
            {doubleDigit(docLimit * i + 1)} to{' '}
            {doubleDigit(docLimit * i + docLimit)}
          </div>
        );
      });

  const checkLastDock = () => {
    if (addCardIsVisible && !filtering) {
      return (
        <AddCard
          totalDoclNumbers={totalDoclNumbers}
          onAddButtonClick={() => {
            setAddButtonClickCount((c) => c + 1);

            fetchData();
          }}
        />
      );
    }
    return null;
  };

  const beginAfterForLastPage = () =>
    (Math.ceil(totalDoclNumbers / docLimit) - 1) * docLimit;

  const debounceFilter = useCallback(
    debounce((query) => {
      fetchData(query);
    }, 500),
    [cards]
  );

  const handleSearchInput = (e) => {
    const query = e.target.value;
    if (!query) return;
    if (!filtering) setFiltering(true);

    debounceFilter(query);
  };

  return (
    <>
      <SearchBar handleSearchInput={handleSearchInput} />
      <div className="nav">
        <RenderDocumentMenu />
      </div>

      {filtering && cards.length <= 0 && (
        <div style={{ textAlign: 'center', paddingTop: '3rem' }}>
          No lists found...
        </div>
      )}

      {cards.length > 0 && (
        <ul className="list">
          {cards.map((card, i) => (
            <li key={card.id} className="list__item" data-id={card.id}>
              <UpdateCard
                key={`update-card-${card.id}`}
                number={
                  beginAfter === -1
                    ? beginAfterForLastPage() + i + 1
                    : beginAfter + i + 1
                }
                card={card}
                addButtonClickCount={addButtonClickCount}
              />
              <DeleteCard
                key={`delete-card-${card.id}`}
                card={card}
                fetchData={fetchData}
              />
            </li>
          ))}
          {checkLastDock()}
        </ul>
      )}
    </>
  );
}

export default DocList;
