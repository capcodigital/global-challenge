import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import { Image } from 'semantic-ui-react';
import Handle from './images/handle.png';

const Sign = ({ children, className }) => (
  <div className={`sign-container ${className}`}>
    <div className="sign">
      <div className="handle-container">
        <Image className="handle" src={Handle} />
        <Image className="handle left" src={Handle} />
      </div>
      <div className="sign-content-container">
        {children}
      </div>
    </div>
  </div>
);

Sign.propTypes = {
  children: PropTypes.array,
  className: PropTypes.string
};

export default Sign;
