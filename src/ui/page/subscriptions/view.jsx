// @flow
import React, { PureComponent } from 'react';
import Page from 'component/page';
import FirstRun from './internal/first-run';
import FileListSubscriptions from 'component/fileListSubscriptions';
import ChannelListDiscover from 'component/channelListDiscover';

type Props = {
  subscribedChannels: Array<string>, // The channels a user is subscribed to
  loading: boolean,
  doFetchMySubscriptions: () => void,
  showSubscriptionHelp: boolean,
  doCompleteFirstRun: () => void,
};

export default class extends PureComponent<Props> {
  componentDidMount() {
    const { doFetchMySubscriptions } = this.props;

    doFetchMySubscriptions();
  }

  render() {
    const { subscribedChannels, loading, doCompleteFirstRun, showSubscriptionHelp } = this.props;

    const numberOfSubscriptions = subscribedChannels && subscribedChannels.length;

    return (
      // Only pass in the loading prop if there are no subscriptions
      // If there are any, let the page update in the background
      // The loading prop removes children and shows a loading spinner
      <Page notContained loading={loading && !subscribedChannels}>
        {showSubscriptionHelp && <FirstRun onFinish={doCompleteFirstRun} />}
        {!showSubscriptionHelp && numberOfSubscriptions > 0 && <FileListSubscriptions />}
        {!showSubscriptionHelp && numberOfSubscriptions === 0 && <ChannelListDiscover />}
      </Page>
    );
  }
}
