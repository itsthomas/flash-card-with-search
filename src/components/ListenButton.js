function ListenButton(props) {
  const { message } = props
  const { language } = props
  const { rate } = props
  const { pitch } = props

  return (
    <>
      <label
        onClick={(e) => {
          if (message.length > 0) {
            const msg = new SpeechSynthesisUtterance(message)
            msg.lang = language
            msg.rate = rate
            msg.pitch = pitch
            window.speechSynthesis.speak(msg)
          }

          e.stopPropagation()
        }}
        className='listen-button'
      />
    </>
  )
}

export default ListenButton
