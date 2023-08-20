
// #region START: Library
// _______________________
import React, { useState } from 'react';
import Modal from 'react-modal';
import '../assets/css/calendar.css';
// _______________________
// #endregion END: Library


const Calendar = () => {

  // #region START: Pre-component definition
  // _______________________
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = new Date(currentDate.getFullYear(), currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentMonth, 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const [todoList, setTodoList] = useState({})
  const [todo, setTodo] = useState({})
  const [isMax, setIsMax] = useState(false)
  const [message, setMessage] = useState("Add to do")
  const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  // _______________________
  // #endregion END: Pre-component definition


  // #region START: Tooltip handler
  // _______________________
  const [tooltipDate, setTooltipDate] = useState(null);

  const handleDateMouseEnter = (date) => {
    setTooltipDate(date);
  };

  const handleDateMouseLeave = () => {
    setTooltipDate(null);
  };

  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDateClick = (date) => {
    setTodo('')
    const checkTodoList = todoList?.[`Day-${date}`]?.length >= 2
    setIsMax(checkTodoList)
    if (checkTodoList) {
      setMessage('Maximum data reached')
      setIsModalOpen(true);
    } else {
      setIsModalOpen(true);
      setSelectedDate(date);

    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTodo('')
    setIsMax(false)
  };

  const handleTodoChange = (e, name) => {
    let oldValue = todoList?.[name] ?? [];
    oldValue.push(todo)

    setTodoList(prevState => ({
      ...prevState,
      [name]: oldValue
    }))

    closeModal()
  }

  const handleChange = (e) => {
    setTodo(e.target.value)
  }
  // _______________________
  // #endregion END: Tooltip handler



  // #region START: Component definition
  // _______________________
  return (
    <div className="calendar">
      <h2>{monthName}</h2>
      <div className="weekdays">
        {weekdays.map(day => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>
      <div className="days">
        {Array.from({ length: firstDayOfMonth }, (_, index) => (
          <div key={`empty-${index}`} className="empty-day" />
        ))}
        {daysArray.map(day => (
          <>
            {/* // >>> this can be store into another component */}
            <div
              key={day}
              className="day"
              onMouseEnter={() => handleDateMouseEnter(day)}
              onMouseLeave={handleDateMouseLeave}
              onClick={() => handleDateClick(day)}
            >
              <div className="day-date">
                {day}
              </div>
              <div className='to-do-list'>
                {todoList?.[`Day-${day}`]?.map((_item, index) => {
                  return (
                    // >>> This card can change with another component like a custom card, snackbar, or etc.
                    <div key={index} className='container-card'>
                      {_item}
                    </div>
                  )
                })}
              </div>
              {tooltipDate === day && <div className="tooltip">Click to add To-Do (Max 2 list)</div>}
            </div>
          </>
        ))}
      </div>
      {/* // >>> this can be changed with another modal library */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add To-Do"
        className="modal"
        overlayClassName="overlay"
      >
        {isMax
          ? <>
            <h2>{message}</h2>
            <button type="button" onClick={closeModal}>Close</button>
          </>
          : <>
            <h2>Add To-Do</h2>
            <h4>{`${selectedDate} ${monthName}`}</h4>
            <form>
              <label>
                Description :
                <input type="text" className='form-input' value={todo} onChange={handleChange} />
              </label>
              <div className='button-container'>
                <button type="button" className='error-button' onClick={closeModal}>Cancel</button>
                <button type="button" className='normal-button' onClick={e => handleTodoChange(e, `Day-${selectedDate}`)}>Save</button>
              </div>
            </form>
          </>
        }

      </Modal>
    </div>
  );
};

// _______________________
// #endregion END: Component definition


export default Calendar;
