import { useState, useEffect } from "react";
import "./App.css";

const MOTIVATIONAL_PHRASES = [
  "Ути какой молодец, ",
  "Что за машинааа, ",
  "SLAYED, ",
  "Ееее, ты справился, ",
  "Потрясающе, ",
  "Так держать, ",
  "Жарайсың, ",
  "Ты лучший, "
];

const TIMER_OPTIONS = [
  { value: 10, label: "10 сек" },
  { value: 20, label: "20 сек" },
  { value: 30, label: "30 сек" }
];

function App() {
  const [selectedTime, setSelectedTime] = useState(0);
  const [name, setName] = useState(() => localStorage.getItem("userName") || "");
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(selectedTime);
  const [phrase, setPhrase] = useState("");
  const [completions, setCompletions] = useState(() => 
    parseInt(localStorage.getItem("completions") || "0")
  );

  //load name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    if (savedName) setName(savedName);
  }, []);

  //save name to localStorage when it changes
  useEffect(() => {
    if (name.trim()) {
      localStorage.setItem("userName", name);
    }
  }, [name]);

  //save completions to localStorage
  useEffect(() => {
    localStorage.setItem("completions", completions.toString());
  }, [completions]);

  useEffect(() => {
    let intervalId: number;
    if (isRunning && time > 0) {
      intervalId = window.setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            const randomPhrase = MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)];
            setPhrase(randomPhrase);
            setCompletions(prev => prev + 1);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, time]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setTime(selectedTime);
      setIsRunning(true);
      setPhrase("");
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(selectedTime);
    setPhrase("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((selectedTime - time) / selectedTime) * 100;

  return (
    <div className="wrapper">
      <form className="container" onSubmit={handleStart}>
        <input 
          type="text"
          placeholder="Your name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isRunning}
        />
        <select
          className="select"
          value={selectedTime}
          onChange={(e) => setSelectedTime(Number(e.target.value))}
          disabled={isRunning}
        >
          {TIMER_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="timer">
          {formatTime(time)}
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="status-text">
          {isRunning && name.trim() && `${name}, ${time} ${time === 1 ? 'second' : 'seconds'} left`}
          {!isRunning && (
            time === 0 ? (phrase + name + "!") : 
            (name.trim() ? `Welcome to Focus Timer! 🎯` : 'Enter your name to start!')
          )}
        </div>
        <div className="completions">
          Completed: {completions} {completions === 1 ? 'time' : 'times'}
        </div>
        <div className="button-group">
          <button 
            type="submit" 
            className="button" 
            disabled={!name.trim() || isRunning}
          >
            {time === 0 ? "Restart" : "Start Timer"}
          </button>
          <button 
            type="button" 
            className="button" 
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
