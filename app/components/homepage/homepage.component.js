import React from 'react';
import { Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Sample1, Sample2 } from 'components/common';
import './style.scss';

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    const { intl: { formatMessage } } = props;

    // Don't put this logic in the render function, it will re-render <FormattedMessage /> every time
    this.state = {
      sampleContentMessage: formatMessage({ id: 'sample.component' }),
      sampleContentFunctionalMessage: formatMessage({ id: 'sample.functional.component' })
    };
  }


  componentDidMount() {
    const { sampleDispatch } = this.props;
    sampleDispatch('Sample redux data');
  }

  render() {
    const { value } = this.props;
    const { sampleContentMessage, sampleContentFunctionalMessage } = this.state;

    return (
      <div>
        <Grid divided="vertically" celled>
          <Grid.Row columns={1}>
            <Grid.Column>
              <h1>
                <FormattedMessage id="homepage.label" />: {value}
              </h1>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column>
              <Sample1 message={sampleContentMessage} id="sample1Button" />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column>
              <Sample2 message={sampleContentFunctionalMessage} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

HomePage.propTypes = {
  sampleDispatch: PropTypes.func,
  value: PropTypes.string,
  intl: PropTypes.object
};

export default injectIntl(HomePage);
