// @flow
import * as ACTIONS from 'constants/action_types';
import { VIEW_ALL } from 'constants/subscriptions';
import { handleActions } from 'util/redux-utils';

type TagState = {};

type Tag = {
  claimsWithTag: number,
  lastUsed: Date,
};

const defaultState: TagState = {
  seenTags: {
    Alternative: undefined,
    Country: undefined,
    Dance: undefined,
    Electronic: undefined,
    Experimental: undefined,
    Hits: undefined,
    Jazz: undefined,
    Metal: undefined,
    Pop: undefined,
    Rap: undefined,
    Rock: undefined,
    Tom: undefined,
  },
  followedTags: ['Country', 'Rap', 'Tom'],
};

export default handleActions(
  {
    TAG_TOGGLE: (state, action) => {
      const { myTags, followedTags } = state;
      const { tag } = action.data;

      const index = followedTags.indexOf(tag);
      let myNewTags = followedTags.slice();

      if (index > -1) {
        myNewTags.splice(index, 1);
      } else {
        myNewTags.push(tag);
        myTags[tag] = undefined;
      }

      return {
        ...state,
        myTags,
        followedTags: myNewTags,
      };
    },

    // 'TAG_ADD': (state, action) => {
    //   const { tag } = action.data;
    //   const { myTags } = state;

    //   myTags[tag.label] = tag;

    //   return {
    //     ...state,
    //     myTags,
    //   };
    // },

    TAG_DELETE: (state, action) => {
      const { myTags, followedTags } = state;
      const { tag } = action.data;

      const index = followedTags.indexOf(tag.label);
      let myNewFollowedTags = followedTags.slice();

      if (index === -1) {
        myNewFollowedTags.splice(index, 1);
      }

      delete myTags[tag.label];

      return {
        ...state,
        myTags,
        followedTags: myNewFollowedTags,
      };
    },
  },
  defaultState
);
