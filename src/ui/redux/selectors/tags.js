import { createSelector } from 'reselect';

// Returns the entire subscriptions state
const selectState = state => state.tags || {};

// Returns the list of channel uris a user is subscribed to
export const selectTags = createSelector(
  selectState,
  state => state.seenTags
);

export const selectFollwedTags = createSelector(
  selectState,
  state => state.followedTags
);

export const selectAllTags = createSelector(
  selectTags,
  selectFollwedTags,
  (tags, myTags) => {
    if (!tags) return [];

    const specialTags = Object.keys(tags).map(tag => {
      return {
        label: tag,
        items: 5,
        isMyTag: myTags.includes(tag),
      };
    });

    return specialTags;
  }
);

// Fetching list of users subscriptions
