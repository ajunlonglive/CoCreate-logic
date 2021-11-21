/*global CoCreate*/
import observer from '@cocreate/observer';
import action from '@cocreate/action';
import passAttributes from "./passAttributes.js";
import attributes from "./attributes.js";
import passValues from "./passValues.js";

const CoCreateLogic = {
	passAttributes: passAttributes,
	attributes: attributes,
	passValues: passValues,
};

const islink = new Map();

function init() {
	__initPassSessionIds(); // will be derprciated for CoCreate-localStorage
	initLinks();
}

// ToDo: can be depreciated do to component localStorage
function __initPassSessionIds() {
	let orgId = window.localStorage.getItem('organization_id');
	let user_id = window.localStorage.getItem('user_id');
	let adminUI_id = window.localStorage.getItem('adminUI_id');
	let builderUI_id = window.localStorage.getItem('builderUI_id');

	__initPassItems(orgId, ".sessionOrg_Id", true);
	__initPassItems(user_id, ".sessionUser_Id");
	__initPassItems(adminUI_id, ".sessionAdminUI_Id");
	__initPassItems(builderUI_id, ".sessionBuilderUI_Id");
}

// ToDo: can be depreciateddo to component localStorage
function __initPassItems(id, selector, noFetch) {
	
	if (id) {
		let elements = document.querySelectorAll(selector);
		elements.forEach(el => {
			passAttributes._setAttributeValue(el, 'document_id', id);
			passAttributes._setAttributeValue(el, 'fetch-document_id', id);
			passAttributes._setAttributeValue(el, 'filter-value', id);
		});
	}
}


function initLinks() {
	document.logic = {islink: 'true'};
	document.addEventListener('click', linkEvent, true);
}

function linkEvent() {
		const target = event.target.closest('[href], [target], [pass_to]');
		if (event.target.closest('button') && !target) {
			event.preventDefault();
		}
		if (!target) return;
		if (target.hasAttribute('actions')) return;
		if (target.closest('[actions]')) return;
		runLink(target);
}


function runLink(target) {
	if (!target) return;
	if (document.logic.link) return;
	const href = target.getAttribute('href');
	passAttributes._setPassAttributes(target);			

	if (target.getAttribute('target') === 'modal') {
		event.preventDefault();
		if (typeof CoCreate.modal !== 'undefined') {
			CoCreate.modal.open(target);
		}
		else if (href) {
			openLink(target);
		}
	}
	else if (href) {
		event.preventDefault();
		openLink(target);
	}

}

function openLink(link) {
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
}

function getDocument(btn) {
	let Document = document;
	let targetSelector = btn.getAttribute('link-target');
	if (targetSelector) {
		if(targetSelector.indexOf(';') !== -1) {
			let documentSelector;
			[documentSelector, targetSelector] = targetSelector.split(';');
			let frame = document.querySelector(documentSelector);
			Document = frame.contentDocument;
		}
	}
	return Document;
}

function disableLinks(btn) {
	let document = getDocument(btn);
	document.logic = {link: 'false'};
	document.removeEventListener("click", linkEvent, true);
	document.addEventListener("click", preventDefault, true);
}

function enableLinks(btn) {
	let document = getDocument(btn);
	document.logic = {link: 'true'};
	document.removeEventListener("click", preventDefault, true);
	document.addEventListener("click", linkEvent, true);
}

function preventDefault(e) {
	e.preventDefault();
}

observer.init({
	name: 'CoCreateAttributes',
	observe: ['addedNodes'],
	target: '[fetch-for]',
	callback: function(mutation) {
		CoCreateLogic.attributes.initElement(mutation.target);
	}
});

observer.init({
	name: 'CoCreateLogic',
	observe: ['addedNodes'],
	target: '[pass_id]',
	callback: function(mutation) {
		CoCreateLogic.passAttributes.initElement(mutation.target);
	}
});

action.init({
	action: "passValueAction",
	endEvent: "passValueActionEnd",
	callback: (btn, data) => {
		CoCreateLogic.passValues.passValueAction(btn);
	},
});

action.init({
	action: "disableLinks",
	endEvent: "disableLinks",
	callback: (btn, data) => {
		disableLinks(btn);
	}
});

action.init({
	action: "enableLinks",
	endEvent: "enableLinks",
	callback: (btn, data) => {
		enableLinks(btn);
	}
});

init();

export default {runLink};
