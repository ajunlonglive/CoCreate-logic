import observer from '@cocreate/observer'
import action from '@cocreate/action'
import passAttributes from "./passAttributes.js"
import attributes from "./attributes.js"
import getValues from "./getValues.js"
import passValues from "./passValues.js"


const CoCreateLogic = {
	passAttributes: passAttributes,
	attributes: attributes,
	passValues: passValues,
	getValues: getValues,

	init: function() {
		this.__initPassSessionIds(); // will be derprciated for CoCreate-localStorage
		this.initLinks();
	},

	// ToDo: can be depreciated do to component localStorage
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
				self.passAttributes._setAttributeValue(el, 'document_id', id);
				self.passAttributes._setAttributeValue(el, 'filter-value', id);
			})
		}
	},


	initLinks: function() {
		const self = this;
		document.addEventListener('click', function(event) {
			const target = event.target.closest('[href], [target], [pass_to]')
			if (!target) return;
			if (target.hasAttribute('actions')) return;
			self.runLink(target)
		})
	},
	
	runLink: function(target) {
		const self = this;
		const href = target.getAttribute('href');
		self.passAttributes._setPassAttributes(target)			

		if (target.getAttribute('target') === 'modal') {
			event.preventDefault();
			if (typeof CoCreate.modal !== 'undefined') {
				CoCreate.modal.open(target);
			}
			else if (href) {
			self.openLink(target);
		}
		}
		else if (href) {
			event.preventDefault();
			self.openLink(target);
		}

	},
	
	openLink: function(link) {
		var href = link.getAttribute('href');
		var target = link.getAttribute('target');

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
	target: '[pass_id]',
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
