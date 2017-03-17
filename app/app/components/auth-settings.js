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
import constants from '../utils/constants';
import encoding from '../utils/encoding';

const {
	computed
} = Ember;

export default Ember.Component.extend({
	isDocumizeProvider: computed.equal('authProvider', constants.AuthProvider.Documize),
	isKeycloakProvider: computed.equal('authProvider', constants.AuthProvider.Keycloak),

	KeycloakUrlError: computed.empty('keycloakConfig.url'),
	KeycloakRealmError: computed.empty('keycloakConfig.realm'),
	KeycloakClientIdError: computed.empty('keycloakConfig.clientId'),
	KeycloakPublicKeyError: computed.empty('keycloakConfig.publicKey'),
	KeycloakAdminUserError: computed.empty('keycloakConfig.adminUser'),
	KeycloakAdminPasswordError: computed.empty('keycloakConfig.adminPassword'),
	keycloakConfig: { 
		url: '',
		realm: '',
		clientId: '',
		publicKey: '',
		adminUser: '',
		adminPassword: ''
	},

	didReceiveAttrs() {
		this._super(...arguments);

		let provider = this.get('authProvider');

		switch (provider) {
			case constants.AuthProvider.Documize:
				break;
			case constants.AuthProvider.Keycloak:
				let config = this.get('authConfig');

				if (is.undefined(config) || is.null(config) || is.empty(config) ) {
					config = {};
				} else {
					config = JSON.parse(config);
					config.publicKey = encoding.Base64.decode(config.publicKey);
				}

				this.set('keycloakConfig', config);
				break;
		}
	},

	actions: {
		onDocumize() {
			this.set('authProvider', constants.AuthProvider.Documize);
		},

		onKeycloak() {
			this.set('authProvider', constants.AuthProvider.Keycloak);
		},

		onSave() {
			let provider = this.get('authProvider');
			let config = this.get('authConfig');

			switch (provider) {
				case constants.AuthProvider.Documize:
					config = {};
					break;
				case constants.AuthProvider.Keycloak:
					if (this.get('KeycloakUrlError')) {
						this.$("#keycloak-url").focus();
						return;
					}
					if (this.get('KeycloakRealmError')) {
						this.$("#keycloak-realm").focus();
						return;
					}
					if (this.get('KeycloakClientIdError')) {
						this.$("#keycloak-clientId").focus();
						return;
					}
					if (this.get('KeycloakPublicKeyError')) {
						this.$("#keycloak-publicKey").focus();
						return;
					}
					if (this.get('KeycloakAdminUserError')) {
						this.$("#keycloak-admin-user").focus();
						return;
					}
					if (this.get('KeycloakAdminPasswordError')) {
						this.$("#keycloak-admin-password").focus();
						return;
					}

					config = Ember.copy(this.get('keycloakConfig'));
					Ember.set(config, 'publicKey', encoding.Base64.encode(this.get('keycloakConfig.publicKey')));
					break;
			}

			this.get('onSave')(provider, config).then(() => {
			});
		},
	}
});