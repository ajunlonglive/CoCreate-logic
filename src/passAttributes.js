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

		let dataAttributes = window.localStorage.getItem('dataAttributes');
		dataAttributes = JSON.parse(dataAttributes);
		if (!dataAttributes || dataAttributes.length == 0) return;
		
		let attrValues = dataAttributes.find(everyItem => everyItem.pass_to == pass_id)
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
		const pass_id = el.getAttribute('data-pass_id')
		const isRefresh = el.hasAttribute('data-pass_refresh') ? true : false;

		if (pass_id != pass_to) return;

		if (collection) {
			this._setAttributeValue(el, 'data-collection', collection, isRefresh);
			this._setAttributeValue(el, 'data-fetch_collection', collection, isRefresh);
			this._setAttributeValue(el, 'data-pass_fetch_collection', collection, isRefresh);
			this._setAttributeValue(el, 'data-pass_collection', collection, isRefresh);
		}

		if (document_id) {
			this._setAttributeValue(el, 'data-document_id', document_id, isRefresh);
			this._setAttributeValue(el, 'data-fetch_document_id', document_id, isRefresh);
			this._setAttributeValue(el, 'data-pass_fetch_document_id', document_id, isRefresh);
			this._setAttributeValue(el, 'data-pass_document_id', document_id, isRefresh);
		}

		if (name) {
			this._setAttributeValue(el, 'name', name, isRefresh);
			this._setAttributeValue(el, 'data-fetch_name', name, isRefresh);
			this._setAttributeValue(el, 'data-pass_name', name, isRefresh);
		}

		if (value) {
			this._setAttributeValue(el, 'value', value, isRefresh);
			this._setAttributeValue(el, 'data-pass_value', value, isRefresh);
		}

		if (prefix) {
			this._setAttributeValue(el, 'name', prefix + el.getAttribute('name'), isRefresh, true);
			this._setAttributeValue(el, 'data-fetch_name', prefix + el.getAttribute('data-fetch_name'), isRefresh, true);
			this._setAttributeValue(el, 'data-pass_prefix', prefix, isRefresh);
		}

		if (filter_name) {
			this._setAttributeValue(el, 'data-filter_name', filter_name, isRefresh);
			this._setAttributeValue(el, 'data-pass_filter_name', filter_name, isRefresh);
		}

		if (filter_value) {
			this._setAttributeValue(el, 'data-filter_value', filter_value, isRefresh);
			this._setAttributeValue(el, 'data-pass_filter_value', filter_value, isRefresh);
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
		let dataAttributes = [];
		const self = this;
		let attrValues = this._getPassAttributes(element);

		if (element.hasAttribute('data-actions')) {
			return;
		}

		if (attrValues.pass_to) {
			dataAttributes.push(attrValues);
		}

		let elements = element.querySelectorAll('[data-pass_to]');

		elements.forEach((el) => {
			let attrValues = self._getPassAttributes(el)
			if (attrValues.pass_to) {
				dataAttributes.push(attrValues);
			}
			self._getPassId(attrValues)
		})
		if (dataAttributes.length > 0) localStorage.setItem('dataAttributes', JSON.stringify(dataAttributes));
	},
	
	_getPassAttributes: function(element) {
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
	
	_getPassId: function(attrValues) {
	    let pass_to = attrValues.pass_to
	    const elements = document.querySelectorAll(`[data-pass_id="${pass_to}"]`)
		for (let element of elements)
        this._setAttributeValues(element, attrValues);
	}
}

CoCreatePassAttributes.init();

export default CoCreatePassAttributes;
