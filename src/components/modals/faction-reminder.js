/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const useStyles = {
  header: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0px 15px 0px 0px',
    height: '40px',
  },
  modal: {
    display: 'flex',
    width: '100%',
    height: '100%',
    position: 'fixed',
    backgroundColor: 'rgba(0, 0, 0, .4)',
    zIndex: '1',
    justifyContent: 'center',
    alignItems: 'center',
    transition: '.4s ease',
  },
  content: {
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    width: '350px',
    height: '135px',
    backgroundColor: '#666666',
    borderRadius: '6px',
  },
  info: { padding: '5px', textAlign: 'center', fontSize: '16px' },
  theX: {
    fontSize: '30px', fontWeight: '700', cursor: 'pointer', alignSelf: 'flex-end',
  },
  modalDisplay: { opacity: '1', transform: 'scale(1)' },
  modalHide: { opacity: '0', transform: 'scale(0)' },
};

function getSpiesText(faction, spies, playerID) {
  if (faction === 'spy') {
    const otherSpies = spies.filter((e) => e !== playerID);
    switch (spies.length) {
      case 2:
        return `Other spies: ${otherSpies[0]}`;
      case 3:
        return `Other spies: ${otherSpies[0]} and ${otherSpies[1]}`;
      case 4:
        return `Other spies: ${otherSpies[0]}, ${otherSpies[1]}, and ${otherSpies[2]}`;
      default:
        return 'We\'re not sure who the spies are';
    }
  }
  return 'You don\'t know who the spies are';
}

const FactionReminder = (props) => {
  const showClassName = props.show ? `${props.classes.modal} ${props.classes.modalDisplay}` : `${props.classes.modal} ${props.classes.modalHide}`;

  const reminderText = props.faction === 'resistance' ? 'You\'re on the resistance'
    : props.faction === 'spy' ? 'You\'re a spy' : 'We\'re not sure what you are';

  const spies = getSpiesText(props.faction, props.spies, props.playerID);

  return (
    <div className={showClassName}>
      <div className={props.classes.content}>
        <div className={props.classes.header}>
          <div className={props.classes.theX} onClick={props.closeModal}>&times;</div>
        </div>
        <div className={props.classes.info}>
          {props.faction === 'resistance' && <div className="filler" />}
          <div className="faction-reminder-text">{reminderText}</div>
          <div className="other-spies-reminder">{spies}</div>
        </div>
      </div>
    </div>
  );
};

export default withStyles(useStyles)(FactionReminder);
