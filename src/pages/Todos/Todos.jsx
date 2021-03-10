/* eslint-disable radix */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { withTheme } from '@emotion/react';
import { withRouter } from 'react-router-dom';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck, faTrash, faPencilAlt, faTimes, faSmile,
} from '@fortawesome/free-solid-svg-icons';
import { TodosInLocalStorage } from '../../hooks/UseStateWithLocalStorage';
import styles from './Todos.module.css';
import Button from '../../components/Button/Button';

const Todos = ({ theme }) => {
  const [time, setTime] = useState(['10:00', '11:00']);
  const [add, setAdd] = useState(false);
  // const [buttonText, setButtonText] = useState('Add Todo');
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = TodosInLocalStorage('todos');

  const { primary, secondary } = theme;

  const onclickNewButton = () => {
    const condiditon = !add;
    setAdd(condiditon);
    // const text = !add ? 'Done' : 'Add Todo';
    // setButtonText(text);
  };

  const onChangeTodo = (e) => {
    setTodo(e.target.value);
  };

  const onClickAddButton = () => {
    const addedTodo = [...todos, { time, todo, isComplete: false }];
    if (todos.length > 1) {
      const len = addedTodo.length - 1;
      let swapped;
      do {
        swapped = false;
        for (let i = 0; i < len; i += 1) {
          const splitedFirstTodo = addedTodo[i].time[0].split(':');
          const parseIntFirstTodo = parseInt(splitedFirstTodo[0]);

          const splitedSecondTodo = addedTodo[i + 1].time[0].split(':');
          const parseIntSecondTodo = parseInt(splitedSecondTodo[0]);
          if (parseIntFirstTodo > parseIntSecondTodo) {
            const tmp = addedTodo[i];
            addedTodo[i] = addedTodo[i + 1];
            addedTodo[i + 1] = tmp;
            swapped = true;
          }
        }
      } while (swapped);
    }
    setTodos(addedTodo);
  };

  // const completeTodo = (index) => {
  //   const addedTodo = [...todos];
  //   addedTodo[index].isComplete = !addedTodo.isComplete;
  //   setTodos(addedTodo);
  // };

  return (
    <div id="schedules" className={styles.schedules}>
      <center>
        <h1>Todos</h1>
        <div style={{ marginTop: '10px' }}>
          <Button onClick={onclickNewButton}>
            <FontAwesomeIcon
              title="Complete"
              color={secondary}
              size="lg"
              icon={!add ? faPencilAlt : faTimes}
            />
          </Button>
        </div>
      </center>

      <br />
      <center>
        { add
          && (
          <div className="todoForm">
            <TimeRangePicker
              onChange={setTime}
              value={time}
              disableClock
            />
            <br />
            <input className={styles.input} onChange={onChangeTodo} type="text" placeholder="Todo" />
            <div style={{ marginTop: '10px' }}>
              <Button onClick={onClickAddButton}>Add</Button>
            </div>
          </div>
          )}

      </center>
      {
        todos.length > 0
        && (
        <table style={{ width: '100%', marginTop: '20px' }}>
          <thead>
            <tr>
              <th className={styles.th}>Time</th>
              <th className={styles.th}>Todo</th>
            </tr>
          </thead>

          <tbody>
            {
              todos.map((data, key) => (
                <tr key={key}>
                  <td className={styles.td}>{`${data.time[0]} - ${data.time[1]}`}</td>
                  <td className={styles.td}>{data.todo}</td>
                  <td className={styles.td}>
                    <FontAwesomeIcon
                      title="Complete"
                      style={{ marginRight: '10px' }}
                      color={primary}
                      size="sm"
                      icon={faCheck}
                    />

                    <FontAwesomeIcon
                      title="Delete"
                      style={{ color: 'red', marginLeft: '10px', cursor: 'pointer' }}
                      size="sm"
                      icon={faTrash}
                      onClick={() => {
                        const removedTodos = todos.filter((_todo, index) => index !== key);
                        setTodos(removedTodos);
                      }}
                    />

                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        )
      }

      {
        todos.length === 0
        && (
          <div style={{ marginTop: '150px', color: primary }}>
            <center>
              <h2>
                Nothing To Do
                {' '}
                <FontAwesomeIcon
                  title="Smile"
                  color={primary}
                  size="lg"
                  icon={faSmile}
                />

              </h2>
            </center>
          </div>
        )
      }

    </div>
  );
};

export default withTheme(withRouter(Todos));