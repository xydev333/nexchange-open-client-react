import React from 'react';
import { I18n, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer>
  <I18n ns="translations">
	  {(t) => (
    <div className="container">
      <ul>
        <li>
          <Link to="/terms-and-conditions">{t('footer.1')}</Link>
        </li>
        <li>
          <Link to="/privacy">{t('footer.2')}</Link>
        </li>
        {/*<li><Link to="/refund-cancellation">{t('footer.6')}</Link></li>*/}
      </ul>

	  <Trans i18nKey="footer.3">
      <p className="text-muted">
        All rights reserved, YOA LTD 2016-2017, England & Wales{' '}
        <a
          href="https://beta.companieshouse.gov.uk/company/10009845"
          target="_blank"
        >
          registered company No. 10009845
        </a>
      </p>
	  </Trans>
    </div>
	)}
	</I18n>
  </footer>
);

export default Footer;
