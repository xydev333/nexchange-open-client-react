import React from 'react';
import config from '../../config';
import helpers from '../../helpers';

const OrderLinks = props => (
    <div id="order-links">
        {props.order &&
            <a href={`${config.API_BASE_URL}/orders/${props.order.unique_reference}`} target="_blank">
                <h4>See your order details on our API</h4>
            </a>}

        {props.coin && props.txId &&
            <a href={helpers.getBlockchainUrl(props.code, props.txId)} target="_blank">
                <h4>See your order details on blockchain</h4>
            </a>}
    </div>
);

export default OrderLinks;
