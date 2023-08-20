import './App.css';
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { useState, useEffect } from 'react'

function App() {
  const defaultInterval = 5000
  const localStorageKey = 'content'
  const message = `Enter the text, separatig each item with line break.\nlike\nthis.`
  const previousData = localStorage.getItem(localStorageKey)
  const handle = useFullScreenHandle()
  const [content, setContent] = useState<string>(previousData !== null ? previousData : message)
  const [items, setItems] = useState<string[]>([])
  const [item, setItem] = useState<string>('')
  const [inter, setInter] = useState<number>(defaultInterval)
  const [time, setTime] = useState<string>((defaultInterval / 1000).toString())

  const handleOnTimeUpdate = () => {
    const parsedTime = parseFloat(time)
    if (!isNaN(parsedTime) && parsedTime > 0) {
      setInter(parsedTime * 1000)
    } else {
      setInter(defaultInterval)
      setTime((defaultInterval / 1000).toString())
    }
  }

  useEffect(() => {
    const preItems = content.split(/\r\n|\n/)
    setItems(preItems.filter((item) => item !== ''))
    localStorage.setItem(localStorageKey, content)
  }, [content])

  const setRandomItem = () => {
    setItem(items[Math.floor(Math.random() * items.length)])
  }

  useEffect(() => {
    const timerId = setInterval(setRandomItem, inter)
    return () => clearInterval(timerId)
  }, [items, inter])

  return (
    <div className="App">
      <div>
        <h2>Content</h2>
        <textarea rows={15} cols={60} value={content} onChange={(e) => setContent(e.target.value)}></textarea>
      </div>
      <div>
        <h2>Interval</h2>
        <p>Update every {inter / 1000} seconds.</p>
        <input
          type='number'
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <button onClick={handleOnTimeUpdate}>Apply</button>
      </div>
      <div>
        <h2>FullScreen</h2>
        <button onClick={handle.enter}>Open</button>
      </div>
      <FullScreen handle={handle}>
        {handle.active && (
          <>
            <h1>{item ? item : '...'}</h1>
            <button onClick={handle.exit}>Close</button>
          </>
        )}
      </FullScreen>
    </div>
  );
}

export default App;
