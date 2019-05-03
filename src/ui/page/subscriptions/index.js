import { connect } from 'react-redux';
import {
  selectSubscriptions,
  selectSubscriptionsBeingFetched,
  selectIsFetchingSubscriptions,
  selectShowSubscriptionHelp,
  selectShowSuggestedSubs,
} from 'redux/selectors/subscriptions';
import { doFetchMySubscriptions, doCompleteFirstRun } from 'redux/actions/subscriptions';
import SubscriptionsPage from './view';

const select = state => ({
  loading:
    selectIsFetchingSubscriptions(state) ||
    Boolean(Object.keys(selectSubscriptionsBeingFetched(state)).length),
  subscribedChannels: selectSubscriptions(state),
  showSubscriptionHelp: selectShowSubscriptionHelp(state),
  showSuggestedSubs: selectShowSuggestedSubs(state),
});

export default connect(
  select,
  {
    doFetchMySubscriptions,
    doCompleteFirstRun,
  }
)(SubscriptionsPage);
