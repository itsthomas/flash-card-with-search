// Destructuring
function TextToSpeech({ message, language, rate, pitch }) {
  return (
    <div
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
  )
}

export default TextToSpeech
