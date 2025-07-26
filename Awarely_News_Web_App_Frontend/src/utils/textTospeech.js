let synth = window.speechSynthesis;
let currentUtterance = null;

export const speakText = (text) => {
  if (synth.speaking) synth.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.rate = 1;
  currentUtterance = utter;
  synth.speak(utter);
};

export const stopSpeaking = () => {
  if (synth.speaking) synth.cancel();
};
