/* eslint-disable */
import { useState } from 'react'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import FlipCard from './FlipCard'
import 'swiper/css';

function FlipCardSwipe({ cards, startPoint, endPoint }) {
  let swiperCards = cards
  const [complete, setComplete] = useState(false)
  if(!isNaN(startPoint) || !isNaN(endPoint)){
    swiperCards = swiperCards.slice(startPoint, endPoint)
  }
  
  return (
    <div className='swipe__card__container visible'>
      <Swiper
        spaceBetween={5}
        slidesPerView={1}
        onReachEnd={() => setComplete(true)}
      >
        {swiperCards.map((card, idx) => (
          <SwiperSlide key={card.id}>
            <FlipCard number={startPoint + idx + 1} card={card} />
          </SwiperSlide>
        ))}
        <div className='card__btn-wrapper'>
          <SwiperButton complete={complete} setComplete={setComplete} />
        </div>
      </Swiper>
    </div>
  )
}

export default FlipCardSwipe

function SwiperButton({ complete, setComplete }) {
  const swiper = useSwiper()
  if (complete) {
    return (
      <button
        type='button'
        className='card__btn'
        onClick={() => {
          swiper.slideTo(0)
          setComplete(false)
        }}
      >
        Start Again
      </button>
    )
  }
  return (
    <button
      type='button'
      className='card__btn'
      onClick={() => swiper.slideNext()}
    >
      Next
    </button>
  )
}
