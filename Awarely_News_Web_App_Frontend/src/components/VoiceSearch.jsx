import { useState, useRef } from 'react'
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid'

const VoiceSearch = ({ onSearch }) => {
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice search is not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setListening(true)
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      onSearch(transcript)
      setListening(false)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setListening(false)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognition.start()
    recognitionRef.current = recognition
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setListening(false)
  }

  return (
    <button
      onClick={listening ? stopListening : startListening}
      className={`flex items-center px-4 py-2 rounded-lg border transition duration-200 ${
        listening
          ? 'bg-red-100 border-red-300 text-red-600'
          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'
      }`}
      title="Voice Search"
    >
      {listening ? (
        <>
          <StopIcon className="h-5 w-5 mr-2" />
          Stop
        </>
      ) : (
        <>
          <MicrophoneIcon className="h-5 w-5 mr-2" />
          Speak
        </>
      )}
    </button>
  )
}

export default VoiceSearch
