// @flow
import React, { useState } from 'react';
import { FormField, FormFieldPrice } from 'component/common/form';

type Props = {
  title: ?string,
  description: ?string,
  disabled: boolean,
  updatePublishForm: ({}) => void,
};

function PublishText(props: Props) {
  const { contentIsFree, fee, updatePublishForm, disabled } = props;

  return (
    <section className="card card--section">
      <header className="card__header">
        <h2 className="card__title">{__('Price')}</h2>
        <p className="card__subtitle">{__('How much will this content cost?')}</p>
      </header>

      <div className="card__content">
        <FormField
          type="radio"
          name="content_free"
          label={__('Free')}
          checked={contentIsFree}
          disabled={disabled}
          onChange={() => updatePublishForm({ contentIsFree: true })}
        />

        <FormField
          type="radio"
          name="content_cost"
          label={__('Choose price')}
          checked={!contentIsFree}
          disabled={disabled}
          onChange={() => updatePublishForm({ contentIsFree: false })}
        />
        {!contentIsFree && (
          <FormFieldPrice
            name="content_cost_amount"
            min="0"
            price={fee}
            onChange={newFee => updatePublishForm({ fee: newFee })}
          />
        )}
        {fee && fee.currency !== 'LBC' && (
          <p className="form-field__help">
            {__(
              'All content fees are charged in LBC. For non-LBC payment methods, the number of credits charged will be adjusted based on the value of LBRY credits at the time of purchase.'
            )}
          </p>
        )}
      </div>
    </section>
  );
}

export default PublishText;
