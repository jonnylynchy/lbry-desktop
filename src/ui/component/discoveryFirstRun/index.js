import { connect } from 'react-redux';
import { selectAllTags } from 'redux/selectors/tags';
import { doToggleTag, doDeleteTag } from 'redux/actions/tags';
import DiscoveryFirstRun from './view';

const select = (state, props) => ({
  tags: selectAllTags(state),
});

export default connect(
  select,
  {
    doToggleTag,
    doDeleteTag,
  }
)(DiscoveryFirstRun);
