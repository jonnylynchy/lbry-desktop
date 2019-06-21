// @flow
import * as ICONS from 'constants/icons';
import React, { useState } from 'react';
import { regexInvalidURI } from 'lbry-redux';
import classnames from 'classnames';
import Button from 'component/button';
import FileSelector from 'component/common/file-selector';

type Props = {
  title: ?string,
  description: ?string,
  disabled: boolean,
  updatePublishForm: ({}) => void,
};

function PublishFile(props: Props) {
  const {
    name,
    balance,
    filePath,
    isStillEditing,
    editingURI,
    clearPublish,
    updatePublishForm,
    channel,
    onChannelSelect,
  } = props;

  function handleFileChange(filePath: string, fileName: string) {
    const newFileParams = { filePath };

    if (!name) {
      const parsedFileName = fileName.replace(regexInvalidURI, '');
      // const uri = this.getNewUri(sparsedFileName, channel);
      newFileParams.name = parsedFileName;
      // newFileParams.uri = uri;
    }

    updatePublishForm(newFileParams);
  }

  return (
    <section
      className={classnames('card card--section', {
        'card--disabled': balance === 0,
      })}
    >
      <header className="card__header">
        <h2 className="card__title card__title--flex-between">
          {__('Publish')}
          {(filePath || !!editingURI) && (
            <Button button="inverse" icon={ICONS.REMOVE} label={__('Clear')} onClick={clearPublish} />
          )}
        </h2>
        {isStillEditing && <p className="card__subtitle">{__('You are currently editing a claim.')}</p>}
      </header>

      <div className="card__content">
        <FileSelector currentPath={filePath} onFileChosen={handleFileChange} />
        {!!isStillEditing && name && (
          <p className="help">
            {__("If you don't choose a file, the file from your existing claim")}
            {` "${name}" `}
            {__('will be used.')}
          </p>
        )}
      </div>
    </section>
  );
}

export default PublishFile;
