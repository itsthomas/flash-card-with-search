import FlipCard from './FlipCard'

function AllFlipCards({ cards }) {
  return (
    <>
      {cards.map((card, i) => (
        <FlipCard key={card.id} card={card} number={i + 1} />
      ))}
    </>
  )
}

export default AllFlipCards
