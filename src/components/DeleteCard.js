import Swal from 'sweetalert2'
import { db } from '../firebase'
// Importing SweetAlert2-react

// card is the prop coming from List.js
// We use distructuring for the card to access its propeties such as card.id
function DeleteCard({ card, fetchData }) {
  // Will also work  without async await.
  const onDelete = () => {
    db.collection('FlashCards')
      .doc(card.id)
      .delete()
      .then(() => {
        // fetch to get updated results from the FireStore collection after deleting a doc
        // This function also triggers a rendering of DockList
        fetchData()
      })
      .catch((error) => {
        console.error('Error removing document: ', error)
      })
  }

  // Showing the item to be delete in the Alert
  let item

  if (card.imgURL) {
    item = `<img src="${card.imgURL}">`
  } else if (card.originalText) {
    item = card.originalText
  } else {
    item = card.translatedText
  }

  // The confirmation alert
  const sweetAlert = () =>
    Swal.fire({
      title: 'Are you sure?',
      html: `<strong>${item}</strong> will be removed permanently!`, // instead of html you could also use text:
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.value) {
        onDelete()
      }
    })

  return (
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    <button
      type='button'
      id='alert'
      className='list__btn list__btn--delete'
      onClick={sweetAlert}
    />
  )
}

export default DeleteCard
