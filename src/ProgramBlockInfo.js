import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as moment from 'moment';

import styled, { css } from 'react-emotion';

import { getRelativeSortedProgramBlocks } from './programBlockHelpers';

const ProgramBlockInfoContainer = styled('div')`
  padding-top: 6rem;
`;

const ProgramBlock = styled('div')`
  opacity: .6;
  display: flex;
  margin-bottom: .5rem;
`;

const programBlocksTime = css`
  min-width: 4rem;
`;

class ProgramBlockInfo extends Component {
  render() {
    const sortedProgramBlocks = getRelativeSortedProgramBlocks(this.props.programBlocks, this.props.currentHour);

    const nextProgramBlock = sortedProgramBlocks.shift();

    return (
      <ProgramBlockInfoContainer>
        { nextProgramBlock &&
          <h4>
            Next up at {moment(nextProgramBlock.fields.startTime, "HH").format("ha")}:
            <br />
            {nextProgramBlock.fields.title}
            <br />
            <br />
          </h4>
        }
        { sortedProgramBlocks.map(({fields}, i) =>
          <ProgramBlock key={i}>
            <div className={programBlocksTime}>{moment(fields.startTime, "HH").format("ha")}</div>
            <div>{fields.title}</div>
          </ProgramBlock>
        )}
      </ProgramBlockInfoContainer>
    );
  }
}

ProgramBlockInfo.propTypes = {
  programBlocks: PropTypes.array.isRequired,
  // currentHour: PropTypes.number.isRequired
}

export default ProgramBlockInfo;
