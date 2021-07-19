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

			// ToDo: think in this case we only need all tags as we dont care if it is for or not... we only interested in datapass_id
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
					self.setPassAttributes(tag, dataParam)
				}
			})
		})
	},

	setPassAttributes: function(el, param) {
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
