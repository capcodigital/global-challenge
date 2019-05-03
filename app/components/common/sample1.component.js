import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import './style.scss';

/**
 * Component is described here
 */
class Sample1 extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = { message: '' };
    this.handleClick = this.handleClick.bind(this);
  }

  // Purely for a cypress test
  handleClick() {
    const { message } = this.props;

    this.setState({ message });
  }

  render() {
    const { message, id } = this.props;

    return (
      <div>
        <Button primary id={id} onClick={this.handleClick}>{message}</Button><br/>
        <h3>setState text:</h3>
        <p id={`${id}_message`}>{ this.state.message }</p>
      </div>
    );
  }
}

Sample1.propTypes = {
  message: PropTypes.string
};

export default Sample1;
