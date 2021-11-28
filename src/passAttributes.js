const CoCreatePassAttributes = {

	init: function() {
		var elements = document.querySelectorAll('[pass_id]');
		this.initElements(elements)
	},

	initElements: function(elements) {
		for (let element of elements)
			this.initElement(element)
	},

	initElement: function(element) {
		let pass_id = element.getAttribute('pass_id');
		if (!pass_id) return;

		let passedAttributes = window.localStorage.getItem('passedAttributes');
		passedAttributes = JSON.parse(passedAttributes);
		if (!passedAttributes || passedAttributes.length == 0) return;
		
		let attrValues = passedAttributes.find(everyItem => everyItem.pass_to == pass_id)
		if (!attrValues) return;
		this._setAttributeValues(element, attrValues)
	},

	_setAttributeValues: function(el, attrValues) {
		const {
			collection,
			document_id,
			name,
			value,
			pass_to,
			filter_name,
			filter_value,
			prefix
		} = attrValues;
		const pass_id = el.getAttribute('pass_id')
		const isRefresh = el.hasAttribute('pass-refresh') ? true : false;

		if (pass_id != pass_to) return;

		if (collection) {
			this._setAttributeValue(el, 'collection', collection, isRefresh);
			this._setAttributeValue(el, 'fetch-collection', collection, isRefresh);
			this._setAttributeValue(el, 'pass-fetch_collection', collection, isRefresh);
			this._setAttributeValue(el, 'pass-collection', collection, isRefresh);
		}

		if (document_id) {
			this._setAttributeValue(el, 'document_id', document_id, isRefresh);
			this._setAttributeValue(el, 'fetch-document_id', document_id, isRefresh);
			this._setAttributeValue(el, 'pass-fetch_document_id', document_id, isRefresh);
			this._setAttributeValue(el, 'pass-document_id', document_id, isRefresh);
		}

		if (name) {
			this._setAttributeValue(el, 'name', name, isRefresh);
			this._setAttributeValue(el, 'fetch-name', name, isRefresh);
			this._setAttributeValue(el, 'pass-name', name, isRefresh);
			this._setAttributeValue(el, 'pass-fetch_name', name, isRefresh);
		}

		if (value) {
			this._setAttributeValue(el, 'value', value, isRefresh);
			this._setAttributeValue(el, 'pass-value', value, isRefresh);
		}

		if (prefix) {
			this._setAttributeValue(el, 'name', prefix + el.getAttribute('name'), isRefresh, true);
			this._setAttributeValue(el, 'fetch-name', prefix + el.getAttribute('fetch-name'), isRefresh, true);
			this._setAttributeValue(el, 'pass-prefix', prefix, isRefresh);
		}

		if (filter_name) {
			this._setAttributeValue(el, 'filter-name', filter_name, isRefresh);
			this._setAttributeValue(el, 'pass-filter-name', filter_name, isRefresh);
		}

		if (filter_value) {
			this._setAttributeValue(el, 'filter-value', filter_value, isRefresh);
			this._setAttributeValue(el, 'pass-filter-value', filter_value, isRefresh);
		}
	},

	_setAttributeValue: function(element, attrname, value, isRefresh, onlyHas) {
		if (value) {
			if (element.hasAttribute(attrname) && onlyHas) {
				element.setAttribute(attrname, value);
				return;
			}
			if (element.hasAttribute(attrname) && (!element.getAttribute(attrname) || isRefresh)) {
				element.setAttribute(attrname, value);
				return
			}
		}
	},

	_setPassAttributes: function(element) {
		let passedAttributes = [];
		const self = this;
		let attrValues = this._getPassAttributes(element);

		// if (element.hasAttribute('actions')) {
		// 	return;
		// }

		if (attrValues.pass_to) {
			passedAttributes.push(attrValues);
			self._getPassId(attrValues)
		}

		let elements = element.querySelectorAll('[pass_to]');

		elements.forEach((el) => {
			let attrValues = self._getPassAttributes(el)
			if (attrValues.pass_to) {
				passedAttributes.push(attrValues);
			}
			self._getPassId(attrValues)
		})
		if (passedAttributes.length > 0) localStorage.setItem('passedAttributes', JSON.stringify(passedAttributes));
	},
	
	_getPassAttributes: function(element) {
		return {
			collection: element.getAttribute('pass-collection') || element.getAttribute('pass-fetch_collection'),
			document_id: element.getAttribute('pass-document_id'),
			name: element.getAttribute('pass-name'),
			value: element.getAttribute('pass-value'),
			pass_to: element.getAttribute('pass_to'),
			filter_name: element.getAttribute('pass-filter-name'),
			filter_value: element.getAttribute('pass-filter-value'),
			prefix: element.getAttribute('pass-prefix') || ""
		}
	},
	
	_getPassId: function(attrValues) {
	    let pass_to = attrValues.pass_to
	    const elements = document.querySelectorAll(`[pass_id="${pass_to}"]`)
		for (let element of elements)
        	this._setAttributeValues(element, attrValues);
	}
}

CoCreatePassAttributes.init();

export default CoCreatePassAttributes;
