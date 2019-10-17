import React from 'react';
import styles from './SupportedAssets.scss';
import { I18n, Trans } from 'react-i18next';
import SupportedAsset from './SupportedAsset/SupportedAsset'


function SupportedAssets() {
  return (
    <React.Fragment>
      <div className="col-md-12">
        <h2>Supported Digital Assets</h2>
      </div>
      <div className="col-md-2">
        <SupportedAsset />
      </div>
    </React.Fragment>
  )
}

export default SupportedAssets