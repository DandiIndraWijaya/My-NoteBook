/* eslint-disable no-mixed-operators */
/* eslint-disable max-len */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable radix */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { withTheme } from '@emotion/react';
import { withRouter } from 'react-router-dom';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSSTransition } from 'react-transition-group';
import {
  faCalendar, faTimes, faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { ScheduleInLocalStorage, UserInLocalStorage } from '../../hooks/UseStateWithLocalStorage';
import Button from '../../components/Button/Button';
import styles from './Schedule.module.css';

const Schedule = ({ theme }) => {
  const { primary, secondary } = theme;
  const [time, setTime] = useState(['06:00', '07:00']);
  const { quote } = UserInLocalStorage('user')[0];
  const [todo, setTodo] = useState('');
  const [add, setAdd] = useState(false);
  const [day, setDay] = useState('Monday');
  const [dayLength, setDayLength] = useState([]);
  const [schedule, setSchedule] = ScheduleInLocalStorage('schedule');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  let tempDay;
  let length = 0;
  let styleTableBorder;
  const currentDateTime = new Date();
  const [onPage, setOnPage] = useState(false);

  useEffect(() => {
    setTimeout(() => setOnPage(true), 500);
  }, []);

  useEffect(() => {
    let monday = 0;
    let tuesday = 0;
    let wednesday = 0;
    let thursday = 0;
    let friday = 0;
    let saturday = 0;
    let sunday = 0;
    schedule.map((s) => {
      if (s.day === 'Monday') {
        monday += 1;
      } else if (s.day === 'Tuesday') {
        tuesday += 1;
      } else if (s.day === 'Wednesday') {
        wednesday += 1;
      } else if (s.day === 'Thursday') {
        thursday += 1;
      } else if (s.day === 'Friday') {
        friday += 1;
      } else if (s.day === 'Saturday') {
        saturday += 1;
      } else if (s.day === 'Sunday') {
        sunday += 1;
      }

      setDayLength([
        monday, tuesday, wednesday, thursday, friday, saturday, sunday,
      ]);
    });
  }, [schedule]);

  const onclickNewButton = () => {
    const condiditon = !add;
    setAdd(condiditon);
  };

  const onChangeTodo = (e) => {
    setTodo(e.target.value);
  };

  const onChangeDay = (e) => {
    setDay(e.target.value);
  };

  const onClickAddButton = () => {
    const addedSchedule = [...schedule, { day, time, todo }];
    if (schedule.length !== 0) {
      const len = addedSchedule.length - 1;
      let swapped;
      do {
        swapped = false;
        for (let i = 0; i < len; i += 1) {
          const splitedFirstTodo = addedSchedule[i].time[0].split(':');
          const parseIntFirstTodo = parseInt(splitedFirstTodo[0]);
          const parseIntTimeStartMin = parseInt(splitedFirstTodo[1]);

          const splitedSecondTodo = addedSchedule[i + 1].time[0].split(':');
          const parseIntSecondTodo = parseInt(splitedSecondTodo[0]);
          const parseIntTimeEndMin = parseInt(splitedSecondTodo[1]);
          if (parseIntFirstTodo > parseIntSecondTodo || parseIntTimeStartMin > parseIntTimeEndMin && parseIntFirstTodo === parseIntSecondTodo) {
            const tmp = addedSchedule[i];
            addedSchedule[i] = addedSchedule[i + 1];
            addedSchedule[i + 1] = tmp;
            swapped = true;
          }
        }
      } while (swapped);
    }
    setSchedule(addedSchedule);
  };

  return (
    <CSSTransition
      in={onPage}
      timeout={1000}
      classNames="alert"
      unmountOnExit
    >
      <div id="schedule" className={styles.schedule}>
        <center>
          <h3>Daily Schedule</h3>
          {
            quote
            && (
            <div style={{ marginTop: '10px', color: 'grey' }}>
              <i>
                <h5>{`''${quote}''`}</h5>
              </i>
            </div>
            )
          }
          <div style={{ marginTop: '10px' }}>
            <Button onClick={onclickNewButton}>
              <FontAwesomeIcon
                title="Complete"
                color={secondary}
                size="md"
                icon={!add ? faCalendar : faTimes}
              />
            </Button>
          </div>
        </center>
        <br />
        <center>
          { add
        && (
        <div className="todoForm">
          <select className={styles.input} style={{ marginTop: '0px' }} onChange={onChangeDay}>
            {days.map((_day, key) => (
              <option value={_day} key={key}>{_day}</option>
            ))}
          </select>
          <div style={{ marginTop: '10px' }}>
            <TimeRangePicker
              onChange={setTime}
              value={time}
              disableClock
            />
          </div>
          <input className={styles.input} onChange={onChangeTodo} type="text" placeholder="Todo" />
          <div style={{ marginTop: '10px' }}>
            <Button onClick={onClickAddButton}>Add</Button>
          </div>
        </div>
        )}

        </center>
        <table style={{ width: '100%', margin: '0px 0px 150px' }}>
          <thead>
            <tr>
              <th className={styles.th}>Day</th>
              <th className={styles.th}>Time & Todo</th>
            </tr>
          </thead>
          <tbody>
            {
          days.map((_day, key) => (
            <tr key={key}>
              <td className={styles.td} style={{ fontWeight: 'bold' }}>{_day}</td>
              {
                schedule.length !== 0
                && (
                <td className={styles.td}>
                  <table style={{ width: '100%' }}>
                    {
                    schedule.map((s, k) => {
                      if (tempDay !== _day) {
                        length = 0;
                      }
                      tempDay = _day;

                      if (s.day === _day) {
                        length += 1;
                        styleTableBorder = length === dayLength[key] ? { border: 'unset' } : {};
                        const splitedTimeStart = s.time[0].split(':');
                        const parseIntTimeStart = parseInt(splitedTimeStart[0]);
                        const parseIntTimeStartMin = parseInt(splitedTimeStart[1]);
                        const splitedTimeEnd = s.time[1].split(':');
                        const parseIntTimeEnd = parseInt(splitedTimeEnd[0]);
                        const parseIntTimeEndMin = parseInt(splitedTimeEnd[1]);
                        let isActive;

                        if (currentDateTime.getDay() === key + 1 && currentDateTime.getHours() * 60 + currentDateTime.getMinutes() >= parseIntTimeStartMin + parseIntTimeStart * 60 && currentDateTime.getHours() * 60 + currentDateTime.getMinutes() <= parseIntTimeEndMin + parseIntTimeEnd * 60) {
                          isActive = true;
                        } else {
                          isActive = false;
                        }
                        const active = isActive ? { color: secondary, backgroundColor: primary } : {};
                        return (
                          <tr key={k} style={active}>
                            <td className={styles.tdInside} style={styleTableBorder}>
                              {s.time[0]}
                              {' '}
                              -
                              {' '}
                              {s.time[1]}
                            </td>
                            <td className={styles.tdInside} style={styleTableBorder}>
                              {s.todo}
                              {' '}
                            </td>
                            <td style={{ backgroundColor: 'white', border: 'unset' }}>
                              <FontAwesomeIcon
                                title="Delete"
                                style={{ color: 'red', marginLeft: '10px', cursor: 'pointer' }}
                                size="xs"
                                icon={faTrash}
                                onClick={() => {
                                  const removedSchedule = schedule.filter((_schedule, index) => index !== k);
                                  setSchedule(removedSchedule);
                                }}
                              />

                            </td>
                          </tr>
                        );
                      }
                    })
                  }
                  </table>
                </td>
                )
              }
              {
                schedule.length === 0
                && <td className={styles.td}>-</td>
              }

            </tr>
          ))
        }
          </tbody>
        </table>
      </div>

    </CSSTransition>

  );
};
export default withTheme(withRouter(Schedule));
