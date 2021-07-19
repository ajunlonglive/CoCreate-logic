import passAttributes from "./passAttributes.js"

const CoCreateLinks = {

	init: function() {
		const self = this;
		document.addEventListener('click', function(event) {
			const target = event.target.closest('a, button')
			if (!target) return;

			if (target.getAttribute('target') === 'modal') {
				event.preventDefault();
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
						const elements = document.querySelectorAll(`[data-pass_id="${pass_to}"]`)
						self.passAttributes.initElements(elements);
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
			const elements = document.querySelectorAll(`[data-pass_id="${pass_to}"]`)
			this.passAttributes.initElements(elements);
		}
	},

	checkOpenCocreateModal: function(atag) {
		if (atag.getAttribute('target') === "modal") {
			return true;
		}
		return false;
	},
}

CoCreateLinks.init();

export default CoCreateLinks
