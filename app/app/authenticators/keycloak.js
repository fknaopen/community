// Copyright 2016 Documize Inc. <legal@documize.com>. All rights reserved.
//
// This software (Documize Community Edition) is licensed under 
// GNU AGPL v3 http://www.gnu.org/licenses/agpl-3.0.en.html
//
// You can operate outside the AGPL restrictions by purchasing
// Documize Enterprise Edition and obtaining a commercial license
// by contacting <sales@documize.com>. 
//
// https://documize.com

import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';
import netUtil from '../utils/net';

const {
	isPresent,
	RSVP: { resolve, reject },
	inject: { service }
} = Ember;

export default Base.extend({
	ajax: service(),
	appMeta: service(),

	restore(data) {
		// TODO: verify authentication data
		if (data) {
			return resolve(data);
		}

		return reject();
	},

	authenticate(data) {
		data.domain = netUtil.getSubdomain();

		if (!isPresent(data.token) || !isPresent(data.email)) {
			return Ember.RSVP.reject("invalid");
		}

		return this.get('ajax').post('public/authenticate/keycloak', {
			data: JSON.stringify(data),
			contentType: 'json'
		});
	},

	invalidate() {
		return resolve();
	}
});