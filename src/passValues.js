const CoCreatePassValues = {

	init: function() {
		var elements = document.querySelectorAll('[data-pass_value_id]');
		this.initElements(elements)
	},

	initElements: function(elements) {
		for (let element of elements)
			this.initElement(element)
	},

	initElement: function(element) {
		let pass_value_id = element.getAttribute('data-pass_value_id');

		if(!pass_value_id) return;
		
		let valueParams = window.localStorage.getItem('valueParams');
		valueParams = JSON.parse(valueParams );
		if (!valueParams || valueParams.length == 0) return;
	        let found = valueParams.find(everyItem => everyItem.pass_value_to == pass_value_id)
			if (['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)) 
				element.value = found.value;
			else 
				element.innerHTML = found.value;
		},

	passValueAction: function(btn) {
		let form = btn.closest('form')
		if (!form) return;

		let elements = form.querySelectorAll('[data-pass_value_to]');
		let valueParams = [];

		elements.forEach(el => {
			const pass_value_to = el.getAttribute('data-pass_value_to');

			let value;

			if (pass_value_to) {
				if (['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) {
					value = el.value;
				}
				else {
					value = el.innerHTML;
				}

				valueParams.push({
					pass_value_to: pass_value_to,
					value: value
				})
			}
		})

		if (valueParams.length > 0) {
			window.localStorage.setItem('valueParams', JSON.stringify(valueParams));
		}

		this.init()

		// Todo: replace with custom event system
		document.dispatchEvent(new CustomEvent('passValueActionEnd', {
			detail: {}
		}))
	},

	initDataPassValues: function() {
		window.localStorage.removeItem('valueParams');
	},
}

CoCreatePassValues.init();

export default CoCreatePassValues;
