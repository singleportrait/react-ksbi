import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCurrentProgramBlock } from './operations/programBlockOperations';

import ProgramBlock from './ProgramBlock';

class ProgramReduxed extends Component {
  componentDidMount() {
    this.initializeProgram();
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.program.sys.id !== prevProps.program.sys.id) {
      console.log("New program selected: ", this.props.program.fields.title);
      this.initializeProgram();
    }
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
    const { title, programBlocks } = program.fields;

    const currentProgramBlock = this.props.programBlocks.currentProgramBlock;

    return (
      <div>
        <h2>You're watching {title}</h2>
        <p>It's {this.props.session.currentHour} o'clock</p>
        { !currentProgramBlock &&
          <em>This program doesn't have any program blocks!</em>
        }
        { currentProgramBlock &&
          <ProgramBlock programBlock={currentProgramBlock} />
        }
        <hr />
        { programBlocks && programBlocks.map(({fields}, i) =>
          <div key={i}>
            {fields.startTime}:00 - {fields.title}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  programBlocks: state.programBlocks,
  session: state.session
});

export default connect(mapStateToProps, { getCurrentProgramBlock })(ProgramReduxed);
