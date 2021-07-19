import observer from '@cocreate/observer'
import action from '@cocreate/action'
import CoCreateAttributes from "./attributes.js"
import passAttributes from "./passAttributes.js"
import getValues from "./getValues.js"
import passValues from "./passValues.js"



//CoCreate.logic.passValues
const CoCreateLogic = {
	attributes: CoCreateAttributes,
	passAttributes: passAttributes,
	getValues: getValues,
	passValues: passValues,

	init: function() {
		this.__initKeys(); // will be depreciated
		this.__initPassSessionIds(); // will be derprciated for CoCreate-localStorage
		// this.__initPassParams();
		// this.__initPassValueParams();
		// this.__initGetValueInput();
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
				self.__setAttributeValueOfElement(el, 'data-document_id', id);
				self.__setAttributeValueOfElement(el, 'data-filter_value', id);
			})
		}
	},


	// initElement: function(container) {
	// 	const self = this;
	// 	let mainContainer = container || document;
	// 	if (!mainContainer.querySelectorAll) {
	// 		return;
	// 	}
	// 	let elements = mainContainer.querySelectorAll('[data-pass_id]');
	// 	elements = Array.from(elements);
	// 	if (mainContainer != document && mainContainer.hasAttribute('data-pass_id')) {
	// 		elements.push(mainContainer)
	// 	}
	// 	let dataParams = window.localStorage.getItem('dataParams');
	// 	dataParams = JSON.parse(dataParams);
	// 	if (!dataParams || dataParams.length == 0) return;

	// 	elements.forEach((el) => {
	// 		if (observer.getInitialized(el)) {
	// 			return;
	// 		}

	// 		const pass_id = el.getAttribute('data-pass_id')
	// 		const paramObj = dataParams.find(x => x.pass_to == pass_id)
	// 		if (!paramObj) return;

	// 		const { collection, document_id, pass_to, prefix } = paramObj;
	// 		observer.setInitialized(el)

	// 		if (el.tagName === "FORM" && !el.getAttribute('data-colleciton') && collection) {
	// 			el.setAttribute('data-colleciton', collection);
	// 		}
	// 		self.__setPassAttributes(el, paramObj);


	// 	});
	// },

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
						self.__initPassParams(pass_to);
					}
				}
			}

		})
	},

	//. passParams
	__initPassParams: function(pass_to) {
		var dataParams = window.localStorage.getItem('dataParams');
		dataParams = JSON.parse(dataParams);

		if (!dataParams || dataParams.length == 0) return;
		let self = this;

		dataParams.forEach(function(dataParam) {
			var param_collection = dataParam.collection;
			var param_document_id = dataParam.document_id;
			var param_prefix = dataParam.prefix;
			var param_pass_to = dataParam.pass_to;

			if (pass_to && param_pass_to != pass_to) {
				return;
			}

			var forms = document.querySelectorAll('form');

			forms.forEach((form) => {
				var pass_id = form.getAttribute('data-pass_id');
				if (pass_id && pass_id == param_pass_to && param_collection && param_collection != "") {
					if (!form.getAttribute('data-collection')) {
						form.setAttribute('data-collection', param_collection);
					}
				}
			})

			var allTags = document.querySelectorAll('[data-pass_id]');
			allTags.forEach((tag) => {
				var pass_id = tag.getAttribute('data-pass_id');
				if (pass_id && pass_id == param_pass_to) {
					self.__setPassAttributes(tag, dataParam)
				}
			})
		})
	},


	__getPassAttributes: function(element) {
		return {
			collection: element.getAttribute('data-pass_collection') || element.getAttribute('data-pass_fetch_collection'),
			document_id: element.getAttribute('data-pass_document_id'),
			name: element.getAttribute('data-pass_name'),
			value: element.getAttribute('data-pass_value'),
			pass_to: element.getAttribute('data-pass_to'),
			filter_name: element.getAttribute('data-pass_filter_name'),
			filter_value: element.getAttribute('data-pass_filter_value'),
			prefix: element.getAttribute('data-pass_prefix') || ""
		}
	},

	__setPassAttributes: function(el, param) {
		const { collection, document_id, name, value, pass_to, filter_name, filter_value, prefix } = param;
		const pass_id = el.getAttribute('data-pass_id')
		const isRefresh = el.hasAttribute('data-pass_refresh') ? true : false;

		if (pass_id != pass_to) return;

		if (collection) {
			this.__setAttributeValueOfElement(el, 'data-collection', collection, isRefresh);
			this.__setAttributeValueOfElement(el, 'data-fetch_collection', collection, isRefresh);
			this.__setAttributeValueOfElement(el, 'data-pass_fetch_collection', collection, isRefresh);
			this.__setAttributeValueOfElement(el, 'data-pass_collection', collection, isRefresh);
		}

		if (document_id) {
			this.__setAttributeValueOfElement(el, 'data-document_id', document_id, isRefresh);
			this.__setAttributeValueOfElement(el, 'data-fetch_document_id', document_id, isRefresh);
			this.__setAttributeValueOfElement(el, 'data-pass_fetch_document_id', document_id, isRefresh);
			this.__setAttributeValueOfElement(el, 'data-pass_document_id', document_id, isRefresh);
		}

		if (name) {
			this.__setAttributeValueOfElement(el, 'name', name, isRefresh);
			this.__setAttributeValueOfElement(el, 'data-fetch_name', name, isRefresh);
			this.__setAttributeValueOfElement(el, 'data-pass_name', name, isRefresh);
		}

		if (value) {
			this.__setAttributeValueOfElement(el, 'value', value, isRefresh);
			this.__setAttributeValueOfElement(el, 'data-pass_value', value, isRefresh);
		}

		if (prefix) {
			this.__setAttributeValueOfElement(el, 'name', prefix + el.getAttribute('name'), isRefresh, true);
			this.__setAttributeValueOfElement(el, 'data-fetch_name', prefix + el.getAttribute('data-fetch_name'), isRefresh, true);
			this.__setAttributeValueOfElement(el, 'data-pass_prefix', prefix, isRefresh);
		}

		if (filter_name) {
			this.__setAttributeValueOfElement(el, 'data-filter_name', filter_name, isRefresh);
			this.__setAttributeValueOfElement(el, 'data-pass_filter_name', filter_name, isRefresh);
		}

		if (filter_value) {
			this.__setAttributeValueOfElement(el, 'data-filter_value', filter_value, isRefresh);
			this.__setAttributeValueOfElement(el, 'data-pass_filter_value', filter_value, isRefresh);
		}
	},

	__setAttributeValueOfElement: function(el, attrname, value, isRefresh, onlyHas) {
		if (value) {
			if (el.hasAttribute(attrname) && onlyHas) {
				el.setAttribute(attrname, value);
				return;
			}
			if (el.hasAttribute(attrname) && (!el.getAttribute(attrname) || isRefresh)) {
				el.setAttribute(attrname, value);
				return
			}
		}
	},

	//. storePassData
	storePassData: function(aTag) {
		let dataParams = [];
		const self = this;
		let param = this.__getPassAttributes(aTag);

		if (aTag.hasAttribute('data-actions')) {
			return;
		}

		if (param.pass_to) {
			dataParams.push(param);
		}

		let tags = aTag.querySelectorAll('[data-pass_to]');

		tags.forEach((tag) => {
			let passParam = self.__getPassAttributes(tag)
			if (passParam.pass_to) {
				dataParams.push(passParam);
			}
		})
		if (dataParams.length > 0) localStorage.setItem('dataParams', JSON.stringify(dataParams));
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
		this.storePassData(aTag);
		if (this.checkOpenCocreateModal(aTag)) {
			if (typeof CoCreate.modal !== 'undefined') {
				CoCreate.modal.open(aTag);
			}
		}
		else if (href) {
			this.openAnother(aTag);
		}
		else if (pass_to) {
			this.__initPassParams(pass_to);
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
		// CoCreateLogic.__initGetValue(mutation.target)
		console.log('data-get_value', mutation.target)
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
