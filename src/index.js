import observer from '@cocreate/observer'
import action from '@cocreate/action'
import CoCreateAttributes from "./attributes.js"
import passAttributes from "./passAttributes.js"
import getValues from "./getValues.js"
import passValues from "./passValues.js"


const CoCreateLogic = {
	attributes: CoCreateAttributes,
	passAttributes: passAttributes,
	getValues: getValues,
	passValues: passValues,

	init: function() {
		this.__initKeys(); // will be depreciated
		this.__initPassSessionIds(); // will be derprciated for CoCreate-localStorage
		this.initAtagElement();
	},

	// ToDo: can be depreciated and handeled by CoCreateJS/core.js
	__initKeys: function() {
		if (window.localStorage.getItem('apiKey')) {
			config.apiKey = window.localStorage.getItem('apiKey');
		}
		if (window.localStorage.getItem('organization_id')) {
			config.organization_Id = window.localStorage.getItem('organization_id');
		}
		if (window.localStorage.getItem('host')) {
			config.host = window.localStorage.getItem('host');
		}
	},

	// ToDo: can be depreciateddo to component localStorage
	__initPassSessionIds: function() {
		let orgId = window.localStorage.getItem('organization_id');
		let user_id = window.localStorage.getItem('user_id');
		let adminUI_id = window.localStorage.getItem('adminUI_id');
		let builderUI_id = window.localStorage.getItem('builderUI_id');

		this.__initPassItems(orgId, ".sessionOrg_Id", true);
		this.__initPassItems(user_id, ".sessionUser_Id");
		this.__initPassItems(adminUI_id, ".sessionAdminUI_Id");
		this.__initPassItems(builderUI_id, ".sessionBuilderUI_Id");
	},

	// ToDo: can be depreciateddo to component localStorage
	__initPassItems: function(id, selector, noFetch) {
		const self = this;
		if (id) {
			let elements = document.querySelectorAll(selector);
			elements.forEach(el => {
				self.passAttributes.__setAttributeValueOfElement(el, 'data-document_id', id);
				self.passAttributes.__setAttributeValueOfElement(el, 'data-filter_value', id);
			})
		}
	},


	initAtagElement: function() {
		const self = this;
		document.addEventListener('click', function(event) {
			const target = event.target.closest('a, button')
			if (!target) return;

			if (target.getAttribute('target') === 'modal') {
				event.preventDefault();
				// event.stopImmediatePropagation()
				self.setLinkProcess(target);
				return;
			}

			const href = target.getAttribute('href');
			if (target.getAttribute('target') !== 'modal') {
				if (target.hasAttribute('data-actions')) return;
				// if (!self.passSubmitProcess(target)) return;
				const pass_to = target.getAttribute('data-pass_to');
				if (href) {
					event.preventDefault();
					self.passAttributes.storePassData(target)
					self.openAnother(target)
				}
				else {
					self.passAttributes.storePassData(target)
					if (pass_to) {
						self.passAttributes.initElement(target);
					}
				}
			}

		})
	},

	//. openAnother
	openAnother: function(atag) {

		var href = atag.getAttribute('href');
		var target = atag.getAttribute('target');

		if (target == "_blank") {
			window.open(href, "_blank");
		}
		else if (target == "_window") {
			window.open(href, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
		}
		else {
			window.open(href, "_self");
		}
	},

	//. clickATaginButton
	setLinkProcess: function(aTag) {

		if (aTag.hasAttribute('data-actions')) {
			return;
		}
		const pass_to = aTag.getAttribute('data-pass_to');
		const href = aTag.getAttribute('href');
		this.passAttributes.storePassData(aTag);
		if (this.checkOpenCocreateModal(aTag)) {
			if (typeof CoCreate.modal !== 'undefined') {
				CoCreate.modal.open(aTag);
			}
		}
		else if (href) {
			this.openAnother(aTag);
		}
		else if (pass_to) {
			this.passAttributes.initElement(pass_to);
		}
	},

	checkOpenCocreateModal: function(atag) {
		if (atag.getAttribute('target') === "modal") {
			return true;
		}
		return false;
	},

}


CoCreateLogic.init();

observer.init({
	name: 'CoCreateAttributes',
	observe: ['addedNodes'],
	target: '[fetch-for]',
	callback: function(mutation) {
		CoCreateLogic.attributes.initElement(mutation.target)
	}
});

observer.init({
	name: 'CoCreateLogic',
	observe: ['addedNodes'],
	target: '[data-pass_id]',
	callback: function(mutation) {
		CoCreateLogic.passAttributes.initElement(mutation.target)
	}
});

observer.init({
	name: 'CoCreateLogic',
	observe: ['addedNodes'],
	target: '[data-get_value]',
	callback: function(mutation) {
		CoCreateLogic.getValues.initElement(mutation.target)
	}
});

action.init({
	action: "passValueAction",
	endEvent: "passValueActionEnd",
	callback: (btn, data) => {
		CoCreateLogic.passValues.passValueAction(btn)
	},
})

export default CoCreateLogic;
