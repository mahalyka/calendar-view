
// #region START: Library
// _______________________
import React, { useState } from 'react';
import Modal from 'react-modal';
import '../assets/css/calendar.css';
// _______________________
// #endregion END: Library

const splitMonthAndYear = (date) => {
  const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
  return monthName
}

const displayDate = (date) => {
  const longDateTimeFormat = new Date(date);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZoneName: 'short' };
  const localizedDateTimeString = longDateTimeFormat.toLocaleString('en-US', options);

  return localizedDateTimeString

}

const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const extractDay = (date) => {
  const longDateTimeFormat = new Date(date);
  const options = { day: 'numeric' };
  const localizedDateTimeString = longDateTimeFormat.toLocaleString('en-US', options);

  return localizedDateTimeString
};


const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};


const Calendar = ({ todoList, setTodoList }) => {

  // #region START: Pre-component definition
  // _______________________
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = new Date(currentDate.getFullYear(), currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentMonth, 1).getDay();
  const monthName = splitMonthAndYear(currentDate);
  const [todo, setTodo] = useState({})
  const [isChangeDate, setIsChangeDate] = useState(false)
  const [email, setEmail] = useState()
  const [dateValue, setDateValue] = useState()
  const [color, setColor] = useState(getRandomColor())
  const [error, setError] = useState(false)
  const [method, setMethod] = useState('create')
  const [selectedList, setSelectedList] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false);
  const [isMax, setIsMax] = useState(false)
  const [message, setMessage] = useState("Add to do")
  const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  // _______________________
  // #endregion END: Pre-component definition


  // #region START: Tooltip handler
  // _______________________
  const [tooltipDate, setTooltipDate] = useState(null);

  const formatDate = (day) => {
    const year = currentDate.getFullYear(); // Get the current year
    const month = currentMonth + 1; // Add 1 to match the month index (0-11)

    // Format day, month, and year as two-digit strings
    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month).padStart(2, '0');

    // Construct the full date in YYYY-MM-DD format
    const selectedDate = `${year}-${formattedMonth}-${formattedDay}T00:00`;

    return selectedDate
  }

  const handleDateMouseEnter = (date) => {
    setTooltipDate(date);
  };

  const handleDateMouseLeave = () => {
    setTooltipDate(null);
  };

  const handleChangeDate = (day) => {
    const format = formatDate(day);
    const extract = extractDay(format)
    setSelectedDate(extract)
    setDateValue(format)

  }

  const handleDateClick = (date) => {
    handleChangeDate(date)
    const checkTodoList = todoList?.[`Day-${date}`]?.length >= 3
    setIsMax(checkTodoList)
    setMethod('create')
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
    setMethod('create')
    setSelectedDate()
    setEmail('')
    setIsMax(false)
  };

  const closeDeleteConfirmation = () => {
    setIsDeleteConfirmation(false);
    setTodo('')
    setMethod('create')
    setSelectedDate()
    setEmail('')
    setIsMax(false)
  };

  const handleUpsert = (name) => {
    if (method === 'update') {
      let oldValue = todoList?.[name] ?? [];
      let newValue = oldValue.map(_item => {
        const newItem = {
          desc: todo,
          date: dateValue,
          email,
          color,
        }
        if (_item === selectedList) {
          return ({
            ...newItem
          })
        }

        return _item
      })

      setTodoList(prevState => ({
        ...prevState,
        [name]: newValue
      }))

      closeModal()

    } else {
      let oldValue = todoList?.[name] ?? [];
      oldValue.push({
        desc: todo,
        date: dateValue,
        email,
        color: getRandomColor(),
      })

      setTodoList(prevState => ({
        ...prevState,
        [name]: oldValue
      }))

      closeModal()
    }
  }

  const handleTodoChange = (name) => {
    const validate = isValidEmail(email) &&
      selectedDate &&
      todo

    if (!validate) {
      setError(true)
    } else {
      handleUpsert(name)
    }
  }

  const handleChange = (e, type) => {
    setError(false)
    const { value } = e.target
    if (type === 'email') {
      setEmail(value)
      const validate = isValidEmail(value);
      if (!validate) {
        setError(true)
      }
    } else if (type === 'date') {
      const extract = extractDay(value)
      setSelectedDate(extract)
      setDateValue(value)
      setIsChangeDate(true)
      const validate = selectedDate
      if (!validate) {
        setError(true)
      }
    } else if (type === 'todo') {
      setTodo(value)
      const validate = todo || todo?.length > 1
      if (!validate) {
        setError(true)
      }
    }
  }

  const handleMouseEnter = (date, index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleEditEvent = (day, data) => {
    setTodo(data.desc)
    setDateValue(data.date)
    setEmail(data.email)
    setColor(data.color)
    setSelectedList(data)
    setIsModalOpen(true);
    setMethod('update')
    setSelectedDate(day);
  };

  const handleDeleteEvent = (date, _item) => {
    handleChangeDate(date)
    setSelectedList(_item)
    setIsDeleteConfirmation(true)
  };

  const handleDelete = (name) => {
    console.log("Log system ~ file: Calendar.jsx:222 ~ handleDelete ~ selectedList:", selectedList)
    let updatedTodoList = { ...todoList };

    if (updatedTodoList[name]) {
      updatedTodoList[name] = updatedTodoList[name].filter(
        (existingItem) => existingItem !== selectedList
      );
      console.log("Log system ~ file: Calendar.jsx:224 ~ handleDelete ~ updatedTodoList:", updatedTodoList)
      setTodoList(updatedTodoList);
    }

    closeDeleteConfirmation()
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
        {daysArray.map((day, index) => (
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
                <div className='to-do-list-scrollable'>
                  {todoList?.[`Day-${day}`]?.map((_item, index) => {
                    return (
                      // >>> This card can change with another component like a custom card, snackbar, or etc.
                      <div
                        key={index}
                        className='container-card'
                        style={{ backgroundColor: _item.color }}
                        onMouseEnter={() => handleMouseEnter(day, index)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {hoveredIndex === index && (
                          <div className='icon-container'>
                            <div className="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditEvent(day, _item)
                              }}>
                              ✏️
                            </div>
                            <div className="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteEvent(day, _item)
                              }}>
                              🗑️
                            </div>
                          </div>
                        )}
                        <div>
                          {_item.desc}
                        </div>
                        <div>
                          {_item.date}
                        </div>
                        <div>
                          {_item.email}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              {tooltipDate === day && (todoList?.[`Day-${day}`]?.length < 3 || !todoList?.[`Day-${day}`])
                ? <div className="tooltip">Click to add To-Do (Max 3 list)</div>
                : null
              }
            </div >
          </>
        ))}
      </div>
      {/* // >>> this can be changed with another modal library */}
      <Modal
        id="add-modal"
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add To-Do"
        className="modal"
        overlayClassName="overlay"
      >
        {isMax
          ? <>
            <h2>{message}</h2>
            <button type="button" className="normal-button" onClick={closeModal}>Close</button>
          </>
          : <>
            <h2>Add To-Do</h2>
            {isChangeDate
              ? <h4>{`${displayDate(dateValue)}`}</h4>
              : <h4>{`${selectedDate} ${monthName}`}</h4>
            }
            <form>
              <label>
                <input type="text" placeholder='Description' className='form-input' value={todo} onChange={e => handleChange(e, 'todo')} />
                <input type="datetime-local" className='form-input' value={dateValue} onChange={e => handleChange(e, 'date')} />
                <input type="email" placeholder='Email Reminder' className='form-input' value={email} onChange={e => handleChange(e, 'email')} />
              </label>
              {error
                ? <div className='error-container'>Invalid Input</div>
                : null
              }
              <div className='button-container'>
                <button type="button" className='error-button' onClick={closeModal}>Cancel</button>
                {error
                  ? null
                  : <button type="button" disabled={error} className='normal-button' onClick={e => handleTodoChange(`Day-${selectedDate}`)}>{method === 'create' ? "Add" : "Update"}</button>
                }
              </div>
            </form>
          </>
        }

      </Modal>

      <Modal
        id="delete-modal"
        isOpen={isDeleteConfirmation}
        onRequestClose={closeDeleteConfirmation}
        contentLabel="Delete confirmation"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Are you sure want to delete this information?</h2>
        <div className='button-container'>
          <button type="button" className='normal-button' onClick={closeDeleteConfirmation}>Cancel</button>
          {error
            ? null
            : <button type="button" disabled={error} className='error-button' onClick={e => handleDelete(`Day-${selectedDate}`)}>Delete</button>
          }
        </div>
      </Modal>
    </div >
  );
};

// _______________________
// #endregion END: Component definition


export default Calendar;
