import { useState } from 'react'
import TextToSpeech from './TextToSpeech'

function FlipCard({ card, number }) {
  const [back, setBack] = useState(false)
  const backLang = card.imgURL ? 'en-GB' : 'de-DE'

  return (
    <div className='scene scene--list visible'>
      <div
        key={card.id}
        className={back ? 'card is-flipped' : 'card'}
        onClick={() => setBack(!back)}
      >
        <div className='card__face card__face--front'>
          {!card.imgURL ? (
            <TextToSpeech
              message={card.originalText}
              language='en-GB'
              pitch={1}
              rate={0.8}
            />
          ) : (
            ''
          )}
          {!back ? <div className='custom-id'>{number}</div> : ''}
          {card.imgURL ? <img src={card.imgURL} alt='' /> : card.originalText}
        </div>
        <div className='card__face card__face--back'>
          <TextToSpeech
            message={card.translatedText}
            language={backLang}
            pitch={1}
            rate={0.8}
          />
          {card.translatedText}
          {card.synonym !== '' ? (
            <div className='synonym'>
              {' '}
              <em>Synonym:</em>
              <br />
              {card.synonym}
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  )
}

export default FlipCard
