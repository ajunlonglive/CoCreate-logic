// import passAttributes from './passAttributes';

// const passAttributesi = await passAttributes;

const CoCreateGetValues = {

	init: function() {
		var elements = document.querySelectorAll('[data-get_value]');
		this.initElements(elements)
	},

	initElements: function(elements) {
		for (let element of elements)
			this.initElement(element)
	},

	initElement: function(element) {

	    let id = element.getAttribute('data-get_value')
		let valueEl = document.getElementById(id);
		if(!valueEl) return;
		this.setValue(valueEl, element)
		
		let self = this;

		if (['INPUT', 'TEXTAREA', 'SELECT'].includes(valueEl.tagName)  || valueEl.contentEditable)
		
		valueEl.addEventListener('input', (e) => {
			self.setValueByFind(e.target)
		})
		
		valueEl.addEventListener('updated_by_fetch', (e) => {
			self.setValueByFind(e.target)
		})

		element.dispatchEvent(new Event("input", {
			"bubbles": true
		}));

	},
	
	setValueByFind: function setValue(valueEl){
	    let id = valueEl.getAttribute('id')
	    if(!id) return;
		var elements = document.querySelectorAll('[data-get_value="' + id + '"]');
		for(let element of elements)
			this.setValue(valueEl, element)

	},
	
	setValue: function(valueEl,element){
		if (valueEl.value) { 
			if (['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName))
				element.value = valueEl.value;
			else
				element.innerText = valueEl.value;
		}
		else
			element.innerHTML = valueEl.innerHTML;
	
	},

}

CoCreateGetValues.init();

export default CoCreateGetValues;
