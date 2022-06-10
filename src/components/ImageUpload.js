import { useState, useEffect } from 'react'
import { storage } from '../firebase'

function ImageUpload({ getURLtoParent, counter, setcounter }) {
  const allInputs = { imgUrl: '' }
  const [imageAsUrl, setImageAsUrl] = useState(allInputs)
  const [image, setImage] = useState(null)

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  // Passing imageAsUrl.imgUrl to parent component (UpdateCard and AddCard)
  if (imageAsUrl.imgUrl) {
    getURLtoParent(imageAsUrl.imgUrl)
    console.log('another')
  }

  useEffect(() => {
    if (counter === 1) {
      setImageAsUrl('')
      setImage(null)
      getURLtoParent('')
      setcounter()
    }
    // setcounter();
    if (image) {
      const uploadTask = storage.ref(`images/${image.name}`).put(image)

      uploadTask.on(
        'state_changed',
        (snapShot) => {
          // Takes a snap shot of the process as it is happening
          console.log(snapShot)
        },
        (error) => {
          // catches the errorors
          console.log(error)
        },
        () => {
          storage
            .ref('images')
            .child(image.name)
            .getDownloadURL()
            .then((fireBaseUrl) => {
              setImageAsUrl((prevObject) => ({
                ...prevObject,
                imgUrl: fireBaseUrl
              }))
            })
        }
      )
    }
  }, [image, counter, getURLtoParent, setcounter])

  return (
    <label htmlFor='upload' className='custom-file-upload'>
      <input type='file' id='upload' onChange={handleChange} />
    </label>
  )
}

export default ImageUpload
