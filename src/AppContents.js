import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { initializeSession } from './actions/sessionActions';
import { initializeChannels } from './operations/channelOperations';

import Channel from './Channel';
import TVGuide from './TVGuide';
import Channels from './Channels';
import WhatIsThisTooltip from './WhatIsThisTooltip';

import styled from 'react-emotion';

import { Logo } from './styles';

const LoadingContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  height: 100vh;
  width: 100vw;
`;

class AppContents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showTooltip: false
    }

    this.toggleTooltip = this.toggleTooltip.bind(this);
  }

  componentDidMount() {
    this.props.initializeSession();
    this.props.initializeChannels();
  }

  toggleTooltip() {
    this.setState({ showTooltip: !this.state.showTooltip });
  }

  render() {
    const NoPrograms = () => {
      return (
        <LoadingContainer>
          <Logo>Locally Grown</Logo>
          <h1>No programs right now.</h1>
          <br /><br />
          <WhatIsThisTooltip toggleInfo={this.toggleTooltip} showInfo={this.state.showTooltip} showLink={false} />
        </LoadingContainer>
      );
    };

    function NoMatch() {
      return (
        <LoadingContainer>
          <Logo>Locally Grown</Logo>
          <h1>Sorry, we couldn&apos;t find that.</h1>
          <br /><br />
          <h4><Link to="/tv-guide">Find something to watch.</Link></h4>
        </LoadingContainer>
      );
    };

    function LoadingState() {
      return (
        <LoadingContainer>
          <Logo>&nbsp;</Logo>
          <h1>Loading Locally Grown...</h1>
          <br /><br />
          <h4>&nbsp;</h4>
        </LoadingContainer>
      );
    }

    function ErrorState() {
      return (
        <LoadingContainer>
          <Logo>Locally Grown</Logo>
          <h1>Sorry, there was an error loading channels.</h1>
          <br /><br />
          <h4>&nbsp;</h4>
        </LoadingContainer>
      );
    }

    return (
      <Router>
        <div className="App">
          { this.props.channels.isLoaded &&
            <Switch>
              { this.props.channels.availableChannels.map((channel, i) =>
                <Route key={i} path={`/${channel.fields.slug}`} render={props => (
                  <Channel {...props} channel={channel} />
                )} />
              )}
              { this.props.channels.hiddenChannels.map((channel, i) =>
                <Route key={i} path={`/${channel.fields.slug}`} render={props => (
                  <Channel {...props} channel={channel} />
                )} />
              )}
              { this.props.channels.currentChannel &&
                <Route exact path="/" render={props => (
                  <Redirect to={`/${this.props.channels.currentChannel.fields.slug}`} />
                )} />
              }
              <Route path="/tv-guide" render={props => (
                <TVGuide {...props} channels={this.props.channels.featuredChannels} />
              )} />
              <Route path="/channels" render={props => (
                <Channels {...props} featuredChannels={this.props.channels.featuredChannels} />
              )} />

              { !this.props.channels.currentChannel &&
                <Route exact path="/" render={props => (
                  <React.Fragment>
                    { this.props.channels.error && ErrorState() }
                    { !this.props.channels.error && NoPrograms() }
                  </React.Fragment>
                )} />
              }
              <Route component={NoMatch} />
            </Switch>
          }
          { !this.props.channels.isLoaded && LoadingState() }
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  channels: state.channels
});

export default connect(mapStateToProps, { initializeSession, initializeChannels })(AppContents);
