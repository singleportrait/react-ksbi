import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import * as moment from 'moment';

import { getCurrentProgramBlock } from './operations/programBlockOperations';

import Video from './Video';
import Navigation from './Navigation';
import ProgramBlockInfo from './ProgramBlockInfo';
import MuteButton from './MuteButton';
import FullscreenButton from './FullscreenButton';
import ChannelButton from './ChannelButton';

import styled, { css } from 'react-emotion';

const VideoControls = styled('div')`
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
`;

const controlButtons = css`
  display: flex;
`;

const VideoPlaceholderWrapper = styled('div')`
  position: relative;
  padding-top: 75%;
  background: url(./static_placeholder_simpler.gif);
  background-size: cover;
`;

class Program extends Component {
  componentDidMount() {
    this.initializeProgram();

    document.title = `${this.props.program.fields.title} | K-SBI`
  }

  initializeProgram() {
    // TODO: Check whether program blocks exist at a higher level?
    // If you go to a direct URL of a channel and it has programs, but they don't have any
    // program blocks inside them, this page errors
    if (this.props.program.fields.programBlocks) {
      const currentProgramBlock = this.props.program.fields.programBlocks.find(programBlock => {
        return programBlock.fields.startTime === this.props.session.currentHour;
      })

      if (currentProgramBlock) {
        this.props.getCurrentProgramBlock(currentProgramBlock.sys.id);
      } else {
        console.log("No current program block!");
      }
    } else {
      console.log("No program blocks!");
    }
  }

  render() {
    const program = this.props.program;
    const { programBlocks } = program.fields;
    const currentProgramBlock = this.props.programBlocks.currentProgramBlock;

    return (
      <div className={programClass}>
        <MediaQuery minDeviceWidth={600}>
          <div className={videoAndControlsColumn}>
            { currentProgramBlock &&
              <React.Fragment>
                <Video
                  video={currentProgramBlock.currentVideo}
                  timestamp={currentProgramBlock.timestampToStartVideo}
                />
                <VideoControls>
                  { this.props.previousChannelSlug &&
                    <ChannelButton direction="previous" to={this.props.previousChannelSlug} />
                  }

                  <div className={controlButtons}>
                    <MuteButton />
                    <FullscreenButton />
                  </div>

                  { this.props.nextChannelSlug &&
                    <ChannelButton direction="next" to={this.props.nextChannelSlug} />
                  }
                </VideoControls>
              </React.Fragment>
            }

            { !currentProgramBlock &&
              <VideoPlaceholderWrapper />
            }
          </div>
          <div className={infoColumn}>
            <Navigation />
            <p>You're watching {this.props.channelTitle}. <a href="">Info</a></p>
            <p>It's {moment(this.props.session.currentHour, "HH").format("h")} o'clock.</p>
            <hr/>
            { currentProgramBlock &&
              <React.Fragment>
                <p>Now playing:</p>
                <h1>{currentProgramBlock.fields.title}</h1>
                <p>{currentProgramBlock.fields.description}</p>
                { currentProgramBlock.programmingLength < 3600 &&
                    <p>
                      <em>Warning! This block of programming runs out at <strong>{Math.round(currentProgramBlock.programmingLength/60)} minutes</strong> after the hour, so you might get some unexpected behavior while viewing this channel.</em>
                    </p>
                }
              </React.Fragment>
            }
            { !currentProgramBlock &&
              <div>
                <br />
                <h1>There's nothing playing on this channel.</h1>
                <br /><br />
                <Link to="/tv-guide">Check out the TV Guide</Link> to find something.
              </div>
            }
            { programBlocks &&
              <ProgramBlockInfo programBlocks={programBlocks} currentHour={this.props.session.currentHour} />
            }
          </div>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={600}>
          { currentProgramBlock &&
            <div>
              You're on a phone! This is still especially in beta, for you
              <Video
                video={currentProgramBlock.currentVideo}
                timestamp={currentProgramBlock.timestampToStartVideo}
              />
              <br />
              <VideoControls>
                <MuteButton />
                <FullscreenButton />
              </VideoControls>
              <br />
              <p>You're watching {this.props.channelTitle}</p>
              <p>Now playing:</p>
              <h1>{currentProgramBlock.fields.title}</h1>
              <p>Description: {currentProgramBlock.fields.description}</p>
            </div>
          }
        </MediaQuery>
      </div>
    );
  }
}

const programClass = css`
  display: flex;
  margin: 1.4rem;
  position: relative;
`;

const videoAndControlsColumn = css`
  position: relative;
  width: 65%;
  transition: width 0.4s ease;
  transform: translateZ(0);
  backface-visibility: hidden;
`;

const infoColumn = css`
  position: absolute;
  right: 0;
  width: 35%;
  padding-left: 1.4rem;
  opacity: 1;
  transition: opacity 0.4s ease, right 0.4s ease;
  transform: translateZ(0);
  backface-visibility: hidden;
`;

const mapStateToProps = state => ({
  programBlocks: state.programBlocks,
  session: state.session
});

export default connect(mapStateToProps, { getCurrentProgramBlock })(Program);
