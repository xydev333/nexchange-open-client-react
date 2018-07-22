import React from 'react';
import { I18n } from 'react-i18next';
import './NotFound.css';

const NotFound = () => (
  <div className="text-center">
    <h1>404</h1>
    <h2>{t('error.notfound')} :(</h2>
  </div>
);

export default NotFound;
