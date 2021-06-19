import observer from '@cocreate/observer'
import utils from '@cocreate/utils';
import crud from '@cocreate/crud-client';

const CoCreateAttributes = {
	//. key: colleciton.document_id.name,
	//. example:  
	/** modules.xxxxx.test: [
	 *	{el: element, attr: 'data-test1'},
	 *	{el: element, attr: 'data-test2'}
	 * ]
	 * 
	 **/
	mainInfo: {},
	
	init: function() {
		// registerModule('fetch-attributes', this, null, this.getRequest, this.renderAttribute);
		const self = this;
		crud.listen('updateDocument', function(data) {
			self.render(data)
		})
		
		crud.listen('readDocument', function(data) {
			self.render(data)
		})
		
		crud.listen('connect', function(data) {
			// self.getRequest()
			self.__getRequest()
		})
	},

	initElement: function(container) {
		const requests = this.__getRequest(container)

		if (requests) {
			
			requests.forEach((req) => {
				crud.readDocument({
					collection: req['collection'],
					document_id: req['document_id']
				})
			})
		}
	},

	render: function(data) {
		const collection = data['collection'];
		const document_id = data['document_id'];
		
		for (let name in data.data) {
			const key = this.__makeKey(collection, document_id, name) 
			const value = data.data[name];
			if (this.mainInfo[key]) {
				this.mainInfo[key].forEach((item) => {
					item.el.setAttribute(item.attr, value);
					
					// if (item.attr == 'data-collection') {
					// 	runInitModule('cocreate-text');						
					// } 
					
					item.el.dispatchEvent(new CustomEvent('CoCreateAttribute-run', {
						eventType: 'rendered',
						item: item.el
					}))
				})
			}
		}
	},
	
	setValue: function(element, data) {
		
	},
	
	__getRequest: function(container) {
		let fetch_container = container || document;
		let elements = fetch_container.querySelectorAll('[fetch-for]');
		let self = this;

		let requestData = [];
		
		if (elements.length === 0 && fetch_container != document && fetch_container.hasAttributes('fetch-for')) {
			elements = [fetch_container];
		}

		elements.forEach((el) => {
			//. check
			const el_collection = el.getAttribute('data-collection')
			const el_documentId = el.getAttribute('data-document_id')
			const el_name = el.getAttribute('name')
			const el_value = el.getAttribute('value')
			
			const attributes = el.attributes;
			
			for (let i = 0; i < attributes.length; i++) {
				let jsonInfo = self.__jsonParse(attributes[i].value);
				if (jsonInfo) {
					let collection = jsonInfo['collection'] || el_collection;
					let document_id = jsonInfo['document_id'] || el_documentId;
					let name = jsonInfo['name'] || el_name;
					let value = jsonInfo['value'] || el_value;
					
					if (jsonInfo['data-pass_id']) {
						let pass_info = self.__checkPassId(jsonInfo['data-pass_id']);
						if (pass_info) {
							collection = pass_info.collection;
							document_id = pass_info.document_id;
							value = pass_info.value;
						} else {
							collection = null;
							document_id = null;
							value = null;
						}
					}

					const key = self.__makeKey(collection, document_id, name);
					
					if (collection && document_id && name) {
						if (!self.mainInfo[key]) {
							self.mainInfo[key] = [];
						}
						self.mainInfo[key].push({el: el, attr: attributes[i].name})
						
						if (!requestData.some((d) => d['collection'] === collection && d['document_id'] === document_id)) {
							requestData.push({collection, document_id})
						}
					}
				}
			}
		})
		return requestData;
	},
	
	__jsonParse: function(str_data) {
		try {
			let json_data = JSON.parse(str_data);
			if (typeof json_data === 'object' && json_data != null) {
				return json_data;
			} else {
				return null;
			}
		} catch (e) {
			return null;
		}
	},
	
	__checkPassId: function(pass_id) {
		var dataParams = localStorage.getItem('dataParams');
		dataParams = JSON.parse(dataParams);

		if (!dataParams || dataParams.length == 0) return null;

		for (var i = 0; i < dataParams.length; i++) {
			if (dataParams[i].pass_to == pass_id) {
				return {
					collection: dataParams[i].collection, 
					document_id: dataParams[i].document_id,
					value: dataParams[i].value
				};
			}
		}
		return null;
	},
	
	__makeKey: function (collection, document_id, name) {
		return `${collection}_${document_id}_${name}`;
	}, 
}


CoCreateAttributes.init();

observer.init({ 
	name: 'CoCreateLogicAttributes', 
	observe: ['addedNodes'],
	callback: function(mutation) {
		if(mutation.target.tagName && mutation.target.hasAttribute('data-for'))
			CoCreateAttributes.initElement(mutation.target)
	}
});

export default CoCreateAttributes;