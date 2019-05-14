export const doToggleTag = tag => ({
  type: 'TAG_TOGGLE',
  data: {
    tag,
  },
});

export const doDeleteTag = tag => ({
  type: 'TAG_DELETE',
  data: {
    tag,
  },
});
