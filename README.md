# material-ui-number-input

The TextField type="number" that user really expects.

Fixing all the bugs inherited by TextField type="number" from the Browser's input type="number".

Such as:

- allows only valid number symbols and special keys to be entered while fixing all Backspace bugs of input type="number" (fixing the posibility that a user might enter ```0.---..12313.``` in the input and you as a developer still get a false validity)
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
    } else {
      emitError('incompleteNumber');
    }
  } else {
    emitError('floatingPoint');
  }
} else if(key === 'Backspace') {
  this.setState({ value: '' });
}
```
- includes validation out of the box for min/max value limits
```js
if((valueChange !== undefined) && (valueChange !== this.props.value)) {
  if(canCallOnKeyDown)  {
    onKeyDown(maskedEvent);
  }
  switch(this._validateValue(valueChange)) {
    case 1:
      emitError('maxValue');
      break;
    case -1:
      emitError('minValue');
      break;
    default:
      this._emitChange(eventValue as React.FormEvent, valueChange, true, 'none');
      break; 
  }
} else if((key.length > 1) && (key !== 'Backspace') && canCallOnKeyDown) {
  onKeyDown(maskedEvent);
}
```
- follows material-ui v0.16 unified onChange event handler callback signature before v0.16 is even released (event, value, valid, error)
-  fully compatible with TextField and input elements when it comes to event passed to event handlers while still keeping maximum performance
-  uses state double while keeping all React principels such as single source of truth and dosen't add extra render cycle commign from state double usage
-  You as a developer can always be sure you get a valid number value when valid arguement of onChange is true
-  You can be sure that mateial-ui-number-input will always try to provide you a valid number when user leaves the input field while still provide validation
```js
private _handleBlur(event) {
  const { showDefaultValue, onBlur, errorText } = this.props;
  const oldValue = this.state.value;
  let value = oldValue;
  let newState: NumberInputState = {};
  if(value[0] === '-') {
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
      error = 'maxValue';
      break;
    case -1:
      error = 'minValue';
      break; 
  }
  const valid = error === 'none';
  if((newState.value !== undefined) || (valid && (errorText !== undefined)) || (!valid && (errorText === undefined))) {
    eventValue.target.value = value;
    this._emitChange(eventValue as React.FormEvent, numberValue, valid, error);
  }
}
```


# Install

```npm install material-ui-number-input```


