import React, { Component } from 'react';
import * as contentful from 'contentful';

class Entries extends Component {
  constructor(props) {
    super(props);

    this.state = {
      entries: []
    }
  }

  client = contentful.createClient({
    space: 'erbmau6qmrq2',
    accessToken: '695bee6907c62bdd8ea1e87ec6be3df327ffd4e07e07537f56b12df267ffccd0'
  })

  componentDidMount() {
    this.fetchEntries().then(this.setEntries);
  }

  fetchEntries = () => this.client.getEntries();

  setEntries = response => {
    this.setState({
      entries: response.items
    });
  }

  render() {
    return (
      <div>
        <div>Hello, I'm a entry</div>

        { this.state.entries.map(({fields}, i) =>
          <div key={i}>
            <h1>{fields.title}</h1>
            <pre>{JSON.stringify(fields, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  }
}

export default Entries;
