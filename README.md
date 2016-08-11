# material-ui-number-input

The TextField type="number" that user really expects.

Fixing all the bugs inherited by `<TextField type="number" />` from the Browser's `<input type="number" />`.

Such as:

- allows only valid number symbols and special keys to be entered while fixing all Backspace bugs of `<input type="number" />` (fixing the posibility that a user might enter ```0.---..12313.``` in the input filed and you as a developer still geting a false validity)
```js
if((event.key.length  > 1) || (event.key.match(/^(\d||\.||\-)$/))) {
  /* ... */
}
```
- emits errors which you can use to give hints to user about what he should enter or even what he entered wrong
```js
if(newValue !== undefined) {
  if(newValue.match(/^-?((0|([1-9]\d{0,}))(\.\d{0,})?)?$/)) {
    eventValue.target.value = newValue;
    this.setState({ value: newValue });
    if(newValue.match(/^-?((0(\.\d+)?)|([1-9]+(\d{0,}\.\d+)?))$/)) {
      valueChange = Number(newValue);
    } else if(newValue !== '') {
      emitError('incompleteNumber');
    }
  } else {
    emitError('floatingPoint');
  }
} else if(key === 'Backspace') {
  this.setState({ value: '' });
}
```
- includes validation out of the box for required & min/max value limits
```js
if(valueChange !== undefined) {
  if(canCallOnKeyDown)  {
    onKeyDown(maskedEvent);
  }
  switch(this._validateValue(valueChange)) {
    case 1:
      emitError('max');
      break;
    case -1:
      emitError('min');
      break;
    default:
      this._emitChange(eventValue, valueChange, true, 'none');
      break; 
  }
} else if((key.length > 1) && (key !== 'Backspace') && canCallOnKeyDown) {
  onKeyDown(maskedEvent);
}
```
- follows material-ui v0.16 unified ```onChange``` event handler callback signature ```released (event, value, ...)``` in the form of ```(event, value, valid, error)``` before v0.16 is even released
-  fully compatible with ```TextField``` and ```input``` elements when it comes to event passed to event handlers while still keeping high performance
-  uses state double while still following all React principels such as single source of truth and skiping an extra render cycle from state double usage
-  You as a developer can always be sure you get a valid number value when third arguement of ```onChange``` is ```true```
-  You can be sure that mateial-ui-number-input will always try to provide you a valid number when user leaves the input field while still providing validation
```js
private _handleBlur(event) {
  const { showDefaultValue, onBlur, errorText } = this.props;
  const oldValue = this.state.value;
  let value = oldValue;
  let newState: NumberInputState = {};
  if(value === '-') {
    value = '';
  } else {
    const last = value.length - 1;
    if(value[last] === '.') {
      newState.value = value.substring(0, last);
    }
  }
  if((value === '') && (showDefaultValue !== undefined)) {
    newState.value = String(showDefaultValue);
  }
  this.setState(newState);
  if(onBlur !== undefined) {
    onBlur(event);
  }
  const numberValue = Number(newState.value !== undefined ? newState.value : oldValue);
  let eventValue = getChangeEvent(event);
  let error = 'none';
  switch(this._validateValue(numberValue)) {
    case 1:
      error = 'max';
      break;
    case -1:
      error = 'min';
      break; 
  }
  if((value === '') && required) {
    error = 'required';
  }
  const valid = error === 'none';
  if((newState.value !== undefined) || (valid && (errorText !== undefined)) || (!valid && (errorText === undefined))) {
    eventValue.target.value = value;
    this._emitChange(eventValue, numberValue, valid, error);
  }
}
```


# Install

```npm install material-ui-number-input```

# Properties

| Name                    | Type       | Default | TextField | Description                                             |
| ----------------------- | ---------- | ------- | --------- | ------------------------------------------------------- |
| children                | *node*     |         | *true*    |                                                         |
| className               | *string*   |         | *true*    | The css class name of the root element. |
| disabled                | *bool*     | *false* | *true*    | Disables the input field if set to true.|
| floatingLabelFixed      | *bool*     | *false* | *true*    | If true, the floating label will float even when there is no value. |
| id                      | *string*   |         | *true*    | The id prop for the input field. |
| name                    | *string*   |         | *true*    | Name applied to the input. |
| fullWidth               | *bool*     | *false* | *true*    | If true, the field receives the property width 100%. |
| underlineShow           | *bool*     | *true*  | *true*    | If true, shows the underline for the input field. |
| showDefaultValue        | *number*   |         | *false*   | The number showed as default value (if input is left empty and if there is onChange handler than it will be invoked with showDefaultValue). |
| min                     | *number*   |         | *false*   | The number used as minimum value limit. |
| max                     | *number*   |         | *false*   | The number used as maximum value limit. |
| reqired                 | *bool*     | *false* | *false*   | If true and if input is left empty than 'required' error will be emited throughout onChange and onErrorChange handlers. |
| value                   | *number*   |         | *true*   | The value of the input field. |
| onChange                | *function* |         | *true*   | Callback function that is fired when input state changes (on valid number value change or on error). |
| onErrorChange           | *function* |         | *false*   | Callback function that is fired when input error status changes. |
| errorText               | *node*     |         | *true*    | The error content to display. |
| errorStyle              | *object*   |         | *true*    | The style object to use to override error styles. |
| floatingLabelFocusStyle | *object*   |         | *true*    | The style object to use to override floating label styles when focused. |
| floatingLabelStyle      | *object*   |         | *true*    | The style object to use to override floating label styles. |
| floatingLabelText       | *node*     |         | *true*    | The content to use for the floating label element. |
| hintStyle               | *object*   |         | *true*    | Override the inline-styles of the TextField's hint text element. |
| hintText                | *node*     |         | *true*    | The hint content to display. |
| inputStyle              | *object*   |         | *true*    | Override the inline-styles of the TextField's input element. When multiLine is false: define the style of the input element. When multiLine is true: define the style of the container of the textarea. |
| style                   | *object*   |         | *true*    | Override the inline-styles of the root element. |
| underlineDisabledStyle  | *object*   |         | *true*    | Override the inline-styles of the TextField's underline element when disabled. |
| underlineFocusStyle     | *object*   |         | *true*    | Override the inline-styles of the TextField's underline element when focussed. |
| underlineStyle          | *object*   |         | *true*    | Override the inline-styles of the TextField's underline element. |
