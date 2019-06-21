// @flow
import React, { useState } from 'react';
import { FormField } from 'component/common/form';

type Props = {
  title: ?string,
  description: ?string,
  disabled: boolean,
  updatePublishForm: ({}) => void,
};

function PublishText(props: Props) {
  const { title, description, updatePublishForm, disabled } = props;
  const [showDescription, setShowDescription] = useState(false);

  return (
    <section className="card--section">
      <div className="card__content">
        <FormField
          type="text"
          name="content_title"
          label={__('Title')}
          placeholder={__('Titular Title')}
          disabled={disabled}
          value={title}
          onChange={e => updatePublishForm({ title: e.target.value })}
        />

        <FormField
          type={showDescription ? 'markdown' : 'textarea'}
          name="content_description"
          label={__('Description')}
          placeholder={__('Description...')}
          value={description}
          disabled={disabled}
          onChange={text => updatePublishForm({ description: text })}
        />
      </div>
    </section>
  );
}

export default PublishText;
