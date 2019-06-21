// @flow
import { COPYRIGHT, OTHER } from 'constants/licenses';
import { CHANNEL_NEW, CHANNEL_ANONYMOUS, MINIMUM_PUBLISH_BID } from 'constants/claim';
import * as React from 'react';
import { isNameValid, buildURI, regexInvalidURI, THUMBNAIL_STATUSES } from 'lbry-redux';
import { Form, FormField, FormFieldPrice, Submit } from 'component/common/form';
import Button from 'component/button';
import ChannelSection from 'component/selectChannel';
import classnames from 'classnames';
import UnsupportedOnWeb from 'component/common/unsupported-on-web';
import BidHelpText from './internal/bid-help-text';
import NameHelpText from './internal/name-help-text';
import LicenseType from './internal/license-type';
import TagSelect from 'component/tagsSelect';
import PublishText from 'component/publishText';
import PublishThumbnail from 'component/publishThumbnail';
import PublishPrice from 'component/publishPrice';
import PublishFile from 'component/publishFile';

type Props = {
  publish: PublishParams => void,
  filePath: ?string,
  bid: ?number,
  editingURI: ?string,
  title: ?string,
  thumbnail: ?string,
  uploadThumbnailStatus: ?string,
  thumbnailPath: ?string,
  description: ?string,
  language: string,
  nsfw: boolean,
  contentIsFree: boolean,
  fee: {
    amount: string,
    currency: string,
  },
  channel: string,
  name: ?string,
  updatePublishForm: UpdatePublishFormData => void,
  nameError: ?string,
  isResolvingUri: boolean,
  winningBidForClaimUri: number,
  myClaimForUri: ?StreamClaim,
  licenseType: string,
  otherLicenseDescription: ?string,
  licenseUrl: ?string,
  uri: ?string,
  bidError: ?string,
  publishing: boolean,
  balance: number,
  isStillEditing: boolean,
  clearPublish: () => void,
  resolveUri: string => void,
  scrollToTop: () => void,
  prepareEdit: (claim: any, uri: string) => void,
  resetThumbnailStatus: () => void,
  amountNeededForTakeover: ?number,
};

class PublishForm extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    (this: any).checkIsFormValid = this.checkIsFormValid.bind(this);
    (this: any).renderFormErrors = this.renderFormErrors.bind(this);
    (this: any).handlePublish = this.handlePublish.bind(this);
    (this: any).handleCancelPublish = this.handleCancelPublish.bind(this);
    (this: any).handleNameChange = this.handleNameChange.bind(this);
    (this: any).handleChannelChange = this.handleChannelChange.bind(this);
    (this: any).editExistingClaim = this.editExistingClaim.bind(this);
    (this: any).getNewUri = this.getNewUri.bind(this);
  }

  componentDidMount() {
    const { thumbnail, name, channel, editingURI } = this.props;
    if (!thumbnail) {
      this.props.resetThumbnailStatus();
    }
    if (editingURI) {
      this.getNewUri(name, channel);
    }
  }

  getNewUri(name: string, channel: string) {
    const { resolveUri } = this.props;
    // If they are midway through a channel creation, treat it as anonymous until it completes
    const channelName = channel === CHANNEL_ANONYMOUS || channel === CHANNEL_NEW ? '' : channel;

    // We are only going to store the full uri, but we need to resolve the uri with and without the channel name
    let uri;
    try {
      uri = buildURI({ contentName: name, channelName });
    } catch (e) {
      // something wrong with channel or name
    }

    if (uri) {
      if (channelName) {
        // resolve without the channel name so we know the winning bid for it
        const uriLessChannel = buildURI({ contentName: name });
        resolveUri(uriLessChannel);
      }
      resolveUri(uri);
      return uri;
    }

    return '';
  }

  handleNameChange(name: ?string) {
    const { channel, updatePublishForm } = this.props;

    if (!name) {
      updatePublishForm({ name: '', nameError: __('A name is required.') });
      return;
    }

    if (!isNameValid(name, false)) {
      updatePublishForm({
        name,
        nameError: __('LBRY names must contain only letters, numbers and dashes.'),
      });
      return;
    }

    const uri = this.getNewUri(name, channel);
    updatePublishForm({
      name,
      uri,
      nameError: undefined,
    });
  }

  handleChannelChange(channelName: string) {
    const { name, updatePublishForm } = this.props;
    const form: UpdatePublishFormData = { channel: channelName };

    if (name) {
      form.uri = this.getNewUri(name, channelName);
    }
    updatePublishForm(form);
  }

  handleBidChange(bid: number) {
    const { balance, updatePublishForm, myClaimForUri } = this.props;

    let previousBidAmount = 0;
    if (myClaimForUri) {
      previousBidAmount = Number(myClaimForUri.amount);
    }

    const totalAvailableBidAmount = previousBidAmount + balance;

    let bidError;
    if (bid === 0) {
      bidError = __('Deposit cannot be 0');
    } else if (totalAvailableBidAmount === bid) {
      bidError = __('Please decrease your deposit to account for transaction fees');
    } else if (totalAvailableBidAmount < bid) {
      bidError = __('Deposit cannot be higher than your balance');
    } else if (bid <= MINIMUM_PUBLISH_BID) {
      bidError = __('Your deposit must be higher');
    }

    updatePublishForm({ bid, bidError });
  }

  editExistingClaim(myClaimForUri: ?{}, uri: string) {
    const { prepareEdit, scrollToTop } = this.props;
    if (myClaimForUri) {
      prepareEdit(myClaimForUri, uri);
      scrollToTop();
    }
  }

  handleCancelPublish() {
    const { clearPublish, scrollToTop } = this.props;
    scrollToTop();
    clearPublish();
  }

  handlePublish() {
    const { filePath, licenseType, licenseUrl, otherLicenseDescription, publish } = this.props;

    let publishingLicense;
    switch (licenseType) {
      case COPYRIGHT:
      case OTHER:
        publishingLicense = otherLicenseDescription;
        break;
      default:
        publishingLicense = licenseType;
    }

    const publishingLicenseUrl = licenseType === COPYRIGHT ? '' : licenseUrl;

    const publishParams: PublishParams = {
      filePath: filePath || undefined,
      bid: this.props.bid || undefined,
      title: this.props.title || '',
      thumbnail: this.props.thumbnail,
      description: this.props.description,
      language: this.props.language,
      nsfw: this.props.nsfw,
      license: publishingLicense,
      licenseUrl: publishingLicenseUrl,
      otherLicenseDescription,
      name: this.props.name || undefined,
      contentIsFree: this.props.contentIsFree,
      fee: this.props.fee,
      uri: this.props.uri || undefined,
      channel: this.props.channel,
      isStillEditing: this.props.isStillEditing,
      claim: this.props.myClaimForUri,
    };

    publish(publishParams);
  }

  checkIsFormValid() {
    const {
      name,
      nameError,
      title,
      bid,
      bidError,
      editingURI,
      isStillEditing,
      filePath,
      uploadThumbnailStatus,
    } = this.props;

    // If they are editing, they don't need a new file chosen
    const formValidLessFile =
      name && !nameError && title && bid && !bidError && !(uploadThumbnailStatus === THUMBNAIL_STATUSES.IN_PROGRESS);
    return editingURI && !filePath ? isStillEditing && formValidLessFile : formValidLessFile;
  }

  renderFormErrors() {
    const {
      name,
      nameError,
      title,
      bid,
      bidError,
      editingURI,
      filePath,
      isStillEditing,
      uploadThumbnailStatus,
    } = this.props;

    const isFormValid = this.checkIsFormValid();

    // These are extra help
    // If there is an error it will be presented as an inline error as well
    return (
      !isFormValid && (
        <div className="card__content error-text">
          {!title && <div>{__('A title is required')}</div>}
          {!name && <div>{__('A URL is required')}</div>}
          {name && nameError && <div>{__('The URL you created is not valid')}</div>}
          {!bid && <div>{__('A deposit amount is required')}</div>}
          {!!bid && bidError && <div>{bidError}</div>}
          {uploadThumbnailStatus === THUMBNAIL_STATUSES.IN_PROGRESS && (
            <div>{__('Please wait for thumbnail to finish uploading')}</div>
          )}
          {!!editingURI && !isStillEditing && !filePath && (
            <div>{__('You need to reselect a file after changing the LBRY URL')}</div>
          )}
        </div>
      )
    );
  }

  render() {
    const {
      filePath,
      editingURI,
      title,
      thumbnail,
      uploadThumbnailStatus,
      description,
      language,
      nsfw,
      contentIsFree,
      fee,
      channel,
      name,
      updatePublishForm,
      bid,
      nameError,
      isResolvingUri,
      winningBidForClaimUri,
      myClaimForUri,
      licenseType,
      otherLicenseDescription,
      licenseUrl,
      uri,
      bidError,
      publishing,
      clearPublish,
      thumbnailPath,
      resetThumbnailStatus,
      isStillEditing,
      amountNeededForTakeover,
      balance,
      tags,
    } = this.props;

    const formDisabled = (!filePath && !editingURI) || publishing;
    const formValid = this.checkIsFormValid();

    let submitLabel;
    if (isStillEditing) {
      submitLabel = !publishing ? __('Edit') : __('Editing...');
    } else {
      submitLabel = !publishing ? __('Publish') : __('Publishing...');
    }

    const shortUri = buildURI({ contentName: name });

    return (
      <React.Fragment>
        <UnsupportedOnWeb />

        <PublishFile />
        <div className={classnames({ 'card--disabled': formDisabled })}>
          <PublishText disabled={formDisabled} />
          <PublishThumbnail />
          <div className="card">
            <TagSelect
              title={__('Tags')}
              help={__('The better the tags, the easier your content is to find.')}
              onSelect={tag => updatePublishForm({ tags: [...tags, tag] })}
              // tagsChosen={tags}
            />
          </div>
          <PublishPrice disabled={formDisabled} />

          <section className="card card--section">
            <header className="card__header">
              <h2 className="card__title">{__('Anonymous or under a channel?')}</h2>
              <p className="card__subtitle">
                {__('This is a username or handle that your content can be found under.')}{' '}
                {__('Ex. @Marvel, @TheBeatles, @BooksByJoe')}
              </p>
            </header>

            <div className="card__content">
              <ChannelSection channel={channel} onChannelChange={this.handleChannelChange} />
            </div>
          </section>

          <section className="card card--section">
            <header className="card__header">
              <h2 className="card__title">{__('Where can people find this content?')}</h2>
              <p className="card__subtitle">
                {__('The LBRY URL is the exact address where people find your content (ex. lbry://myvideo).')}{' '}
                <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/naming" />
              </p>
            </header>

            <div className="card__content">
              <fieldset-group class="fieldset-group--smushed fieldset-group--disabled-prefix">
                <fieldset-section>
                  <label>{__('Name')}</label>
                  <span className="form-field__prefix">{`lbry://${
                    !channel || channel === CHANNEL_ANONYMOUS || channel === CHANNEL_NEW ? '' : `${channel}/`
                  }`}</span>
                </fieldset-section>
                <FormField
                  type="text"
                  name="content_name"
                  value={name}
                  onChange={event => this.handleNameChange(event.target.value)}
                  error={nameError}
                />
              </fieldset-group>
              <div className="form-field__help">
                <NameHelpText
                  isStillEditing={isStillEditing}
                  uri={uri}
                  myClaimForUri={myClaimForUri}
                  onEditMyClaim={this.editExistingClaim}
                />
              </div>
            </div>

            <div className={classnames('card__content', { 'card--disabled': !name })}>
              <FormField
                className="form-field--price-amount"
                type="number"
                name="content_bid"
                step="any"
                label={__('Deposit (LBC)')}
                postfix="LBC"
                value={bid}
                error={bidError}
                min="0"
                disabled={!name}
                onChange={event => this.handleBidChange(parseFloat(event.target.value))}
                placeholder={winningBidForClaimUri ? winningBidForClaimUri + 0.1 : 0.1}
                helper={
                  <BidHelpText
                    uri={shortUri}
                    isResolvingUri={isResolvingUri}
                    amountNeededForTakeover={amountNeededForTakeover}
                  />
                }
              />
            </div>
          </section>

          <section className="card card--section">
            <div className="card__content">
              <FormField
                type="checkbox"
                name="content_is_mature"
                label={__('Mature audiences only')}
                checked={nsfw}
                onChange={() => updatePublishForm({ nsfw: !nsfw })}
              />

              <FormField
                label={__('Language')}
                type="select"
                name="content_language"
                value={language}
                onChange={event => updatePublishForm({ language: event.target.value })}
              >
                <option value="en">{__('English')}</option>
                <option value="zh">{__('Chinese')}</option>
                <option value="fr">{__('French')}</option>
                <option value="de">{__('German')}</option>
                <option value="jp">{__('Japanese')}</option>
                <option value="ru">{__('Russian')}</option>
                <option value="es">{__('Spanish')}</option>
                <option value="id">{__('Indonesian')}</option>
                <option value="it">{__('Italian')}</option>
                <option value="nl">{__('Dutch')}</option>
                <option value="tr">{__('Turkish')}</option>
                <option value="pl">{__('Polish')}</option>
                <option value="ms">{__('Malay')}</option>
              </FormField>

              <LicenseType
                licenseType={licenseType}
                otherLicenseDescription={otherLicenseDescription}
                licenseUrl={licenseUrl}
                handleLicenseChange={(newLicenseType, newLicenseUrl) =>
                  updatePublishForm({
                    licenseType: newLicenseType,
                    licenseUrl: newLicenseUrl,
                  })
                }
                handleLicenseDescriptionChange={event =>
                  updatePublishForm({
                    otherLicenseDescription: event.target.value,
                  })
                }
                handleLicenseUrlChange={event => updatePublishForm({ licenseUrl: event.target.value })}
              />
            </div>
          </section>

          <section className="card card--section">
            <div className="card__actions">
              <Button
                button="primary"
                onClick={this.handlePublish}
                label={submitLabel}
                disabled={formDisabled || !formValid || uploadThumbnailStatus === THUMBNAIL_STATUSES.IN_PROGRESS}
              />
              <Button button="link" onClick={this.handleCancelPublish} label={__('Cancel')} />
            </div>
            <p className="help">
              {__('By continuing, you accept the')}{' '}
              <Button button="link" href="https://www.lbry.com/termsofservice" label={__('LBRY Terms of Service')} />.
            </p>
          </section>
          {!formDisabled && !formValid && this.renderFormErrors()}
        </div>
      </React.Fragment>
    );
  }
}

export default PublishForm;
