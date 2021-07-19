const CoCreatePassAttributes = {

	init: function() {
		var elements = document.querySelectorAll('[data-pass_id]');
		this.initElements(elements)
	},

	initElements: function(elements) {
		for (let element of elements)
			this.initElement(element)
	},

	initElement: function(element) {
		let pass_id = element.getAttribute('data-pass_id');
		if (!pass_id) return;

		let dataParams = window.localStorage.getItem('dataParams');
		dataParams = JSON.parse(dataParams);
		if (!dataParams || dataParams.length == 0) return;
		let found = dataParams.find(everyItem => everyItem.pass_to == pass_id)
		this.setPassAttributes(element, found)

	},

	setPassAttributes: function(el, found) {
		const {
			collection,
			document_id,
			name,
			value,
			pass_to,
			filter_name,
			filter_value,
			prefix
		} = found;
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
}

CoCreatePassAttributes.init();

export default CoCreatePassAttributes;
