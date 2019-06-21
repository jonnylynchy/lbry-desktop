// @flow
import React, { useState } from 'react';
import { THUMBNAIL_STATUSES } from 'lbry-redux';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import SelectThumbnail from 'component/selectThumbnail';

type Props = {
  uploadThumbnailStatus: ?string,
};

function PublishThumbnail(props: Props) {
  const {
    uploadThumbnailStatus,
    updatePublishForm,
    filePath,
    thumbnail,
    thumbnailPath,
    resetThumbnailStatus,
    disabled,
  } = props;

  return (
    <section className="card card--section">
      {/* <header className="card__header"> */}
      {/* <h2 className="card__title">{__('Thumbnail')}</h2> */}
      <p className="card__subtitle">
        {(uploadThumbnailStatus === undefined && __('You should reselect your file to choose a thumbnail')) ||
          (uploadThumbnailStatus === THUMBNAIL_STATUSES.API_DOWN ? (
            __('Enter a URL for your thumbnail.')
          ) : (
            <React.Fragment>
              {__('Upload your thumbnail (.png/.jpg/.jpeg/.gif) to')}{' '}
              <Button button="link" label={__('spee.ch')} href="https://spee.ch/about" />.{' '}
              {__('Recommended size: 800x450 (16:9)')}
            </React.Fragment>
          ))}
      </p>
      {/* </header> */}

      <SelectThumbnail
        filePath={filePath}
        thumbnailPath={thumbnailPath}
        thumbnail={thumbnail}
        uploadThumbnailStatus={uploadThumbnailStatus}
        updatePublishForm={updatePublishForm}
        formDisabled={disabled}
        resetThumbnailStatus={resetThumbnailStatus}
      />
    </section>
  );
}

export default PublishThumbnail;
