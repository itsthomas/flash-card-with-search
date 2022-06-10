import { useState } from 'react'
import { db, firebase } from '../firebase'
import ImageUpload from './ImageUpload'

function AddCard({ totalDoclNumbers, onAddButtonClick }) {
  const [newOriginalText, setNewOriginalText] = useState([])
  const [newSynonym, setNewSynonym] = useState([])
  const [newTranslatedText, setNewTranslatedText] = useState([])
  const [imgURL, setimgURL] = useState('')
  const [counter, setCounter] = useState(0)
  const nextNumber = totalDoclNumbers + 1

  // Will also work  without async await.
  const onAdd = async () => {
    const card = await db.collection('FlashCards').add({
      originalText: newOriginalText,
      synonym: newSynonym,
      translatedText: newTranslatedText,
      imgURL,
      createdAt: firebase.firestore.Timestamp.fromDate(new Date())
    })

    // setNewOriginalText('');
    // pass the newly created card here so you could use it in `UpdateCard`
    onAddButtonClick(card) // this looks likes where it belongs.
    setCounter(1)
  }

  return (
    <ul className='list'>
      {/* See: https://stackoverflow.com/questions/34006333/cant-type-in-react-input-text-field */}
      {/* And: https://stackoverflow.com/questions/30727837/react-change-input-defaultvalue-by-passing-props */}
      <li className='list__item list__item--add' key={nextNumber}>
        {/* Filling page elements with data from the DB */}
        <input
          type='text'
          className='list__input'
          readOnly
          defaultValue={nextNumber}
        />
        <div className='list__textarea-wrapper'>
          {imgURL ? (
            <img src={imgURL} alt='' className='img' />
          ) : (
            <>
              <textarea
                className='list__textarea--original'
                placeholder='English'
                onChange={(e) => setNewOriginalText(e.target.value)}
              />
              <textarea
                className='list__textarea--synonym'
                placeholder='Synonym'
                onChange={(e) => setNewSynonym(e.target.value)}
              />
            </>
          )}
          <ImageUpload
            getURLtoParent={(url) => setimgURL(url)}
            counter={counter}
            setcounter={() => setCounter(0)}
          />
        </div>
        <div className='list__textarea-wrapper'>
          <textarea
            className='list__textarea'
            placeholder='Translation'
            onChange={(e) => setNewTranslatedText(e.target.value)}
          />
        </div>
        <button
          type='button'
          className='list__btn list__btn--add'
          onClick={onAdd}
        >
          Add
        </button>
      </li>
    </ul>
  )
}

export default AddCard
