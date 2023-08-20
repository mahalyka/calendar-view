
// #region START: Library
// _______________________
import { useState, useEffect } from 'react'
import { Calendar } from './components'
import './assets/css/App.css';

// _______________________
// #endregion END: Library


function App() {

  // #region START: Handler
  // _______________________
  const [showCalendar, setShowCalendar] = useState(false);
  const initTodo = JSON.parse(localStorage.getItem('todos')) ?? {};
  const [todoList, setTodoList] = useState(initTodo);

  const handleClick = () => {
    setShowCalendar(!showCalendar)
  }

  useEffect(() => {
    // Load todos from local storage when component mounts
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    if (storedTodos) {
      setTodoList(storedTodos); // Update state with stored todos
    }
  }, []);

  useEffect(() => {
    // Save todos to local storage whenever todos change
    localStorage.setItem('todos', JSON.stringify(todoList));
  }, [todoList]);
  // _______________________
  // #endregion END: Handler


  // #region START: COmponent
  // _______________________
  return (
    <div className={`landing-page ${showCalendar ? '' : "landing-page-landing"}`}>
      {showCalendar
        ? <div>
          <Calendar todoList={todoList} setTodoList={setTodoList} />
        </div>
        : <>
          <div className='container'>
            <h2>Angiosty To Do - Calendar View</h2>
            <button className='explore-button' onClick={handleClick}>Your Calendar Here</button>
          </div>
          <div className='angiosty'>Hi there, how are you? When you look at this pages or codes, this is only for you to learn. I made this for technical test in a company in Indonesia. I'm writing this to make sure that you do not shocked why am I still doing this. PS: FP Angiosty </div>
        </>
      }
    </div>
  );

  // _______________________
  // #endregion END: COmponent

}

export default App;
