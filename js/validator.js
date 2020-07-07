define(() => {

    /**
     * Form Validator will iterate through all input, textarea and select elements from the specified container.
     * 
     * To declare a data type for validation, use data-type="<type>, <othertype>, <anothertype>".
     * 
     * Elements that are not do not pass validation will have the 'invalid' class ADDED to the classlist.
     * Elements that do pass validation will have the 'invalid' class REMOVED from the classlist, if present.
     * 
     * Avoid using "no-special" type on phone numbers, dates and emails.
     */
    class Validator {

        /**
         * Initalize the Form Input Validator Module.
         * @param {object} options Object with configuration.
         * @param {string} options.container ID of element container.
         */
        constructor(options) {
            this._container = options.container = document.getElementById(options.container);
            this._toValidate = [];
            this._errorList = [];
            this._validated = [];
            this._validateTypes = {
                "email": this.validateEmail,
                "phone": this.validatePhone,
                "required": this.validateRequired,
                "date": this.validateDate,
                "no-special": this.validateNoSpecialCharacters
            };
        }

        validateForm(containerID) {
            let self = this;

            if (!self._container && !containerID)
                return false;
            else if (containerID)
                self._container = document.getElementById(containerID);

            if (self._container !== null) {
                this._resetForm();

                $.each($(self._container).find('input, textarea, select').not(':input[type=button]').not(':input[type=radio]').not(':input[type=checkbox]').not(':input[type=hidden]').not(':input[type=select-one]'), function (idx, val) {
                    self._toValidate.push(val);
                });

                $.each(self._toValidate, function (idx, item) {
                    if (!item.dataset.type) return;

                    let dataTypes = item.dataset.type.split(',');

                    if (dataTypes.length === 1) {
                        switch (item.dataset.type.trim()) {
                            case 'email':
                                if (self._validateTypes['email'](item))
                                    self._validated.push(item);
                                else
                                    self._errorList.push(item);
                                break;
                            case 'phone':
                                if (self._validateTypes['phone'](item))
                                    self._validated.push(item);
                                else
                                    self._errorList.push(item);
                                break;
                            case 'required':
                                if (self._validateTypes['required'](item))
                                    self._validated.push(item);
                                else
                                    self._errorList.push(item);
                                break;
                            case 'date':
                                if (self._validateTypes['date'](item))
                                    self._validated.push(item);
                                else
                                    self._errorList.push(item);
                                break;
                            case 'no-special':
                                if (self._validateTypes['no-special'](item))
                                    self._validated.push(item);
                                else
                                    self._errorList.push(item);
                                break;
                            default:
                                break;
                        }
                    } else if (dataTypes.length > 1) {

                        let itemIsNotValid;

                        $.each(dataTypes, function (i, type) {
                            switch (type.trim()) {
                                case 'email':
                                    if (!self._validateTypes['email'](item))
                                        itemIsNotValid = true;
                                    break;
                                case 'phone':
                                    if (!self._validateTypes['phone'](item))
                                        itemIsNotValid = true;
                                    break;
                                case 'required':
                                    if (!self._validateTypes['required'](item))
                                        itemIsNotValid = true;
                                    break;
                                case 'date':
                                    if (!self._validateTypes['date'](item))
                                        itemIsNotValid = true;
                                    break;
                                case 'no-special':
                                    if (!self._validateTypes['no-special'](item))
                                        itemIsNotValid = true;
                                    break;
                                default:
                                    break;
                            }
                        });

                        if (itemIsNotValid)
                            self._errorList.push(item);
                        else
                            self._validated.push(item);
                    }
                });

                // Remove invalid class from validated elements, if present.
                $.each(self._validated, (i, v) => {
                    v.classList.remove('invalid');
                });

                // Add invalid class to invalid elements.
                $.each(self._errorList, (i, v) => {
                    v.classList.add('invalid');
                });

                if (self._errorList.length === 0)
                    return true;
                else
                    return false;
            }
        }

        _resetForm() {
            $.each(this._errorList, (i, v) => {
                v.classList.remove('invalid');
            });

            this._toValidate = [];
            this._errorList = [];
            this._validated = [];
        }

        /**
         * Validates specified phone number
         * @param {Element} phone Tests form for any element with data-type="phone" attribute.
         * @returns {Boolean} returns true if phone number is valid.
         */
        validatePhone(phone) {
            let reg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                value = phone.value;

            // regex returns false for empty string..  we don't want empty dates to always return false 
            // because we already have a data type 'required' to handle required fields, therefore empty dates will return true by default.
            if (reg.test(value) || value.length === 0)
                return true;
            else
                return false;
        }

        /**
         * Validates specified email
         * @param {Element} email Tests form for any element with data-type="email" attribute.
         * @returns {Boolean} returns true if email is valid.
         */
        validateEmail(email) {
            let reg = /^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i,
                value = email.value.toLowerCase();

            // regex returns false for empty string..  we don't want empty dates to always return false 
            // because we already have a data type 'required' to handle required fields, therefore empty dates will return true by default.
            if (reg.test(value) || value.length === 0)
                return true;
            else
                return false;
        }

        /**
         * Validates that required input field isn't empty
         * @param {Element} input Tests form for any element with data-type="required" attribute.
         * @returns {Boolean} returns true if input is valid.
         */
        validateRequired(input) {
            let value = input.value;

            if (value.length > 0)
                return true;
            else
                return false;
        }

        /**
         * Validates that no special characters are in the elements value.
         * @param {Element} input Tests any element in the form with data-type="no-special" attribute.
         * @returns {Boolean} returns true if input is valid.
         */
        validateNoSpecialCharacters(input) {
            let reg = /^[a-zA-Z0-9_-\s]*$/,
            value = input.value;

            // The above regex will check if value contains a special character, so here we validate if NOT true.
            if (reg.test(value))
                return true;
            else
                return false;
        }

        /**
         * Validates required input field
         * @param {Element} date Tests form for any element with data-type="date" attribute.
         * @returns {Boolean} returns true if input is valid.
         */
        validateDate(date) {
            let reg = /^(19[7-9][0-9]|20[0-4][0-9]|2050)[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01])$/igm,
                value = date.value;

            // regex returns false for empty string..  we don't want empty dates to always return false 
            // because we already have a data type 'required' to handle required fields, therefore empty dates will return true by default.
            if (reg.test(value) || value.length === 0)
                return true;
            else
                return false;
        }

    }

    return Validator;
});