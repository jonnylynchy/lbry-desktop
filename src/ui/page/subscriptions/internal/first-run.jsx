// @flow
import React, { Fragment } from 'react';
import Button from 'component/button';
import Yrbl from 'component/yrbl';
import * as ICONS from 'constants/icons';
import Icon from 'component/common/icon';

type Props = {
  onFinish: () => void,
};

export default (props: Props) => {
  const { onFinish } = props;

  return (
    <Fragment>
      <Yrbl
        title={
          <span>
            How To <strike>Be A</strike> Sub
          </span>
        }
        subtitle={
          <React.Fragment>
            <p>
              {__(
                'Subscriptions let you stay current with the latest from your favorite creators.'
              )}
            </p>
            <p>
              Click the <Icon icon={ICONS.SUBSCRIPTION} iconColor="red" /> to subscribe to a creator
              you like and their content will show in this area.
            </p>
            <div className="card__actions">
              <Button button="primary" onClick={onFinish} label={__('Got It')} />
            </div>
          </React.Fragment>
        }
      />
    </Fragment>
  );
};
