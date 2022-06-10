import { useState } from 'react'
import { db } from '../firebase'
import ImageUpload from './ImageUpload'

// card is the prop coming from List.js
// We use distructuring for the card to access its propeties such as card.id
function UpdateCard({ card, number }) {
  const [originalText, setOriginalText] = useState(card.originalText)
  const [synonym, setSynonym] = useState(card.synonym)
  const [translatedText, setTranslatedText] = useState(card.translatedText)
  const [imgURL, setimgURL] = useState(card.imgURL)
  // console.log(card.id);
  // Connecting to firebase and writing in to DB
  // FlashCards is the name of my collection on FireBase server
  // Will also work  without async await.
  const onUpdate = async () => {
    console.log(card.id)
    await db
      .collection('FlashCards')
      .doc(card.id)
      // .limit(1) // This will break the update function
      // .set or .update transfers new data to the FireBase DataBase (FlashCards collection)
      .update({ ...card, originalText, synonym, translatedText, imgURL })
    // .set({ ...card, originalText, translatedText, imgURL });
  }

  return (
    <>
      <input type='text' className='list__input' value={number} readOnly />
      {/* Filling elements with data from the DB */}
      <div className='list__textarea-wrapper'>
        {imgURL ? (
          <img src={imgURL} alt='' className='img' />
        ) : (
          <>
            <textarea
              className='list__textarea--original'
              value={originalText}
              onChange={(e) => {
                setOriginalText(e.target.value)
              }}
            />
            <textarea
              className='list__textarea--synonym'
              value={synonym}
              onChange={(e) => {
                setSynonym(e.target.value)
              }}
            />
          </>
        )}
        <ImageUpload
          getURLtoParent={(url) => {
            setimgURL(url)
            setOriginalText('')
          }}
        />
      </div>

      <div className='list__textarea-wrapper'>
        <textarea
          className='list__textarea'
          value={translatedText}
          onChange={(e) => {
            setTranslatedText(e.target.value)
          }}
        />
      </div>
      <button
        type='button'
        className='list__btn list__btn--update'
        onClick={onUpdate}
      >
        Update
      </button>
    </>
  )
}

export default UpdateCard
