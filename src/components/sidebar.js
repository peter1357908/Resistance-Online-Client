/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import Chat from './chat';
import { Phase } from '../resources/phase';
import DirectionsModal from './modals/directions-modal';
import { setModalToDisplay } from '../actions';

function mapStateToProps(reduxState) {
  return {
    gamePhase: reduxState.inGame.gamePhase,
    victoriousFaction: reduxState.postGame.victoriousFaction,
  };
}

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      showDirections: false,
    };
  }

  openDirections = () => {
    this.setState({ showDirections: true });
  }

  closeDirections = () => {
    this.setState({ showDirections: false });
  }

  redirectToDiscord = () => {
    window.open('https://discord.gg/c3vAtpF', '_blank');
  }

  toggleCollapse = () => {
    if (this.state.show) {
      this.setState({ show: false });
    } else {
      this.setState({ show: true });
    }
  }

  redirectToDiscord = () => {
    window.open('https://discord.gg/c3vAtpF', '_blank');
  }

  renderFactionReminderButton = () => {
    if (this.props.gamePhase !== Phase.VIEWING_TEAM && this.props.victoriousFaction === '') {
      return (
        <div className="row-2">
          <Button variant="secondary" className="faction-reminder-button" onClick={() => this.props.setModalToDisplay('FACTION_REMINDER')}>Show Faction</Button>
        </div>
      );
    }
    return <div />;
  }

  renderMaterial = () => {
    if (this.state.show) {
      return (
        <div className="sidebar-material">
          <div className="sidebar-buttons">
            <div className="row-1">
              <Button variant="secondary" className="directions-button" onClick={this.openDirections}>Directions</Button>
              <Button variant="secondary" className="discord-button" onClick={this.redirectToDiscord}>Join Discord</Button>
            </div>
            {this.renderFactionReminderButton()}
          </div>
          <Chat />
        </div>
      );
    }
    return <div className="sidebar-material" />;
  }

  render() {
    return (
      <div className="sidebar-container">
        <DirectionsModal show={this.state.showDirections} closeModal={this.closeDirections} />
        {this.renderMaterial()}
        <div role="button" tabIndex="0" className="sidebar-toggle" onClick={this.toggleCollapse}>
          {this.state.show && <i className="fas fa-caret-left" />}
          {!this.state.show && <i className="fas fa-caret-right" />}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, { setModalToDisplay })(SideBar);
