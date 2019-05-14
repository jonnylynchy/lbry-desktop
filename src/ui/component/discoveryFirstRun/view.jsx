// @flow
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import vis from 'vis';
import { Form, FormField } from 'component/common/form';

type Props = {
  onSelect: string => void,
  selected: Array<string>,
  selectableTags: Array<string>,
};

export default function DiscoveryFirstRun(props: Props) {
  console.log('props', props);

  const { tags, doToggleTag, doDeleteTag } = props;
  const [newTag, setNewTag] = useState('');

  function onChange(e) {
    setNewTag(e.target.value);
  }

  function handleSubmit() {
    doToggleTag(newTag);
    setNewTag('');
  }

  return (
    <section className="discover-section">
      <h1 className="discover-section__title">Discover</h1>

      <Form onSubmit={handleSubmit}>
        <FormField onChange={onChange} placeholder="Search for more tags" type="text" value={newTag} />
      </Form>

      <div className="discover-section__tags">
        {tags.map(tag => {
          return (
            <div
              className={classNames({
                'discover-section__tag': true,
                selected: tag.isMyTag,
              })}
              onClick={() => doToggleTag(tag.label)}
              key={tag.label}
            >
              {tag.label}
              <span className="discover-section__tag-close" onClick={() => doDeleteTag(tag)}>
                &times;
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
