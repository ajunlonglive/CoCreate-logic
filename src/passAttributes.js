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
		if (!found) return;
		this._setAttributeValues(element, found)

	},

	_setAttributeValues: function(el, param) {
		const {
			collection,
			document_id,
			name,
			value,
			pass_to,
			filter_name,
			filter_value,
			prefix
		} = param;
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

	_setAttributeValue: function(el, attrname, value, isRefresh, onlyHas) {
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

	setPassAttributes: function(element) {
		let dataParams = [];
		const self = this;
		let param = this._getPassAttributes(element);

		if (element.hasAttribute('data-actions')) {
			return;
		}

		if (param.pass_to) {
			dataParams.push(param);
		}

		let elements = element.querySelectorAll('[data-pass_to]');

		elements.forEach((el) => {
			let passParam = self._getPassAttributes(el)
			if (passParam.pass_to) {
				dataParams.push(passParam);
			}
			self._getPassId(passParam)
		})
		if (dataParams.length > 0) localStorage.setItem('dataParams', JSON.stringify(dataParams));
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
	
	_getPassId: function(passParam) {
	    let pass_to = passParam.pass_to
	    const elements = document.querySelectorAll(`[data-pass_id="${pass_to}"]`)
		for (let element of elements)
        this._setAttributeValues(element, passParam);
	}
}

CoCreatePassAttributes.init();

export default CoCreatePassAttributes;
