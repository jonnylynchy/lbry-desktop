import React from 'react';

import { connect } from 'react-redux';
import * as settings from 'constants/settings';
import {
  selectSubscriptionClaims,
  selectSubscriptions,
  selectSubscriptionsBeingFetched,
  selectIsFetchingSubscriptions,
  selectUnreadSubscriptions,
  selectViewMode,
} from 'redux/selectors/subscriptions';
import { doSetViewMode } from 'redux/actions/subscriptions';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import FileListSubscriptions from './view';

const select = state => ({
  loading:
    false ||
    selectIsFetchingSubscriptions(state) ||
    Boolean(Object.keys(selectSubscriptionsBeingFetched(state)).length),
  subscribedChannels: selectSubscriptions(state),
  autoDownload: makeSelectClientSetting(settings.AUTO_DOWNLOAD)(state),
  subscriptions: selectSubscriptionClaims(state),
  unreadSubscriptions: selectUnreadSubscriptions(state),
  viewMode: selectViewMode(state),
});

export default connect(
  select,
  {
    doSetViewMode,
  }
)(FileListSubscriptions);
