import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import './style.scss';

/**
 * Component is described here
 */
const Sample2 = ({ message }) => (
  <div>
    <Button secondary>{message}</Button>
  </div>
);

Sample2.propTypes = {
  message: PropTypes.string
};

export default Sample2;
