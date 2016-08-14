# material-ui-number-input

The better TextField for number inputs.

Fixing all the bugs inherited by `<TextField type="number" />` from the Browser's `<input type="number" />`.

Such as:

- allows only valid number symbols and special keys to be entered while fixing all Backspace bugs of `<input type="number" />` (fixing the posibility that a user might enter ```0.---..12313.``` in the input filed and you as a developer still geting a false validity)
- emits errors which you can use to give hints to user about what he should enter or even what he entered wrong
- includes validation out of the box for required & min/max value limits
- follows material-ui v0.16 unified `onChange` event handler callback signature `(event, value, ...)` in the form of `(event, value, complete)` before v0.16 is even released
-  fully compatible with `TextField` and `input` elements when it comes to event passed to event handlers while still keeping high performance
-  You as a developer can always be sure you get a valid number value by implementing `componentDidUpdate` as demonstrated in [Example](https://github.com/NoHomey/material-ui-number-input#example)
-  You can be sure that mateial-ui-number-input will always try to provide you a valid number when user leaves the input field while still providing validation

# Install

`npm install material-ui-number-input`

# Changelog

**Check [Change log](https://github.com/NoHomey/material-ui-number-input/blob/master/CHANGELOG.md) for changes.**

# Properties

| Name                    | Type       | Default   | TextField | Description                                             |
| ----------------------- | ---------- | --------- | --------- | ------------------------------------------------------- |
| children                | *node*     |           | *true*    |                                                         |
| className               | *string*   |           | *true*    | The css class name of the root element. |
| disabled                | *bool*     | *false*   | *true*    | Disables the input field if set to true.|
| floatingLabelFixed      | *bool*     | *false*   | *true*    | If true, the floating label will float even when there is no value. |
| id                      | *string*   |           | *true*    | The id prop for the input field. |
| name                    | *string*   |           | *true*    | Name applied to the input. |
| fullWidth               | *bool*     | *false*   | *true*    | If true, the field receives the property width 100%. |
| underlineShow           | *bool*     | *true*    | *true*    | If true, shows the underline for the input field. |
| showDefaultValue        | *number*   |           | *false*   | The number showed as default value (if input is left empty and if there is onChange handler than it will be invoked with showDefaultValue). |
| min                     | *number*   |           | *false*   | The number used as minimum value limit. |
| max                     | *number*   |           | *false*   | The number used as maximum value limit. |
| reqired                 | *bool*     | *false*   | *false*   | If true and if input is left empty than 'required' error will be emited throughout onChange and onErrorChange handlers. |
| value                   | *string*   | *''*      | *true*   | The value of the input field. |
| onChange                | *function* |           | *true*   | Callback function that is fired when input filed must change it's value. **Signature:** `function(event: React.FormEvent, value: string, complate: boolean) => void`. |
| error                   | *'none' \| 'invalidSymbol' \| 'incompleteNumber' \| 'singleMinus' \| 'singleFloatingPoint' \| 'singleZero' \| 'min' \| 'max' \| 'required'* | *'none'* | *false* | Error status required in order to decide when to call onError when error changes. |
| onError           | *function* |         | *false*   | Callback function that is fired when input error status changes.  **Signature:** `function(error: 'none' | 'invalidSymbol' | 'incompleteNumber' | 'singleMinus' | 'singleFloatingPoint' | 'singleZero' | 'min' | 'max' | 'required') => void`. |
| errorText               | *node*     |           | *true*    | The error content to display. |
| errorStyle              | *object*   |           | *true*    | The style object to use to override error styles. |
| floatingLabelFocusStyle | *object*   |           | *true*    | The style object to use to override floating label styles when focused. |
| floatingLabelStyle      | *object*   |           | *true*    | The style object to use to override floating label styles. |
| floatingLabelText       | *node*     |           | *true*    | The content to use for the floating label element. |
| hintStyle               | *object*   |           | *true*    | Override the inline-styles of the TextField's hint text element. |
| hintText                | *node*     |           | *true*    | The hint content to display. |
| inputStyle              | *object*   |           | *true*    | Override the inline-styles of the TextField's input element. When multiLine is false: define the style of the input element. When multiLine is true: define the style of the container of the textarea. |
| style                   | *object*   |           | *true*    | Override the inline-styles of the root element. |
| underlineDisabledStyle  | *object*   |           | *true*    | Override the inline-styles of the TextField's underline element when disabled. |
| underlineFocusStyle     | *object*   |           | *true*    | Override the inline-styles of the TextField's underline element when focussed. |
| underlineStyle          | *object*   |           | *true*    | Override the inline-styles of the TextField's underline element. |

# Errors

## 'none'

Fired when input's value is valid (there is no error).

## 'required'

Fired when `required` prop is `true` and user leaves empty the input or it gets cleard after onBlur listener.

## 'invalidSymbol'

Fired when user enters none special key which is different than `-`,`.`,`[0-9]`.

## 'incompleteNumber'

Fired wehn user enters `-` as first char in the input or when user enters the first `.`.

## 'singleMinus'

Fired when user enters `-` not as a first char.

## 'singleFloatingPoint'

Fired when user enters `.` and there is already one entered.

## 'singleZero'

Fired when user has entered `0` as first char and enters a digit key.

## 'min'

Fired when user enters number less than `min` prop value.

## 'max'

Fired when user enters number greater than `max` prop value.

# Example

```js
import * as React from 'react';
import NumberInput from 'material-ui-number-input';

class Demo extends React.Component {
  constructor(props) {
  super(props);
  this.state = {};
  
  this.onKeyDown = (event) => {
    console.log(`onKeyDown ${event.key}`);
  };
  
  this.onChange = (event, value, complete) => {
    const e = event;
    console.log(`onChange ${e.target.value}, ${value}, ${complete}`);
    this.setState({ value: value });
  };
  
  this.onError = (error) => {
    let errorText;
    console.log(error);
    switch (error) {
      case 'required':
        errorText = 'This field is required';
        break;
      case 'invalidSymbol':
        errorText = 'You are tring to enter none number symbol';
        break;
      case 'incompleteNumber':
        errorText = 'Number is incomplete';
        break;
      case 'singleMinus':
        errorText = 'Minus can be use only for negativity';
        break;
        case 'singleFloatingPoint':
          errorText = 'There is already a floating point';
          break;
        case 'singleZero':
          errorText = 'Floating point is expected';
          break;
        case 'min':
            errorText = 'You are tring to enter number less than -10';
            break;
        case 'max':
            errorText = 'You are tring to enter number greater than 12';
            break;
      }
      this.setState({
        errorText: errorText,
        error: error
      });
    };
  }
    
  componentDidMount() {
    this.onError('required');
  }
  
  componentDidUpdate(props, state) {
    const { error: prevError } = state;
    const { error, value } = this.state;
    if((error === 'none') && (prevError !== 'none')) {
      alert(`${Number(value)} is a valid number`);
    }
  }
    
  render() {
    const { state, onChange, onError, onKeyDown } = this;
    const { error, value, errorText } = state;  
    return (
      <NumberInput
        id="num"
        required
        min={-10}
        max={12}
        value={value}
        error={error}
        errorText={errorText}
        onChange={onChange}
        onError={onError}
        onKeyDown={onKeyDown} />
    );
  }
}
```

# Written in Typescript and Typescript Ready! ([check example](https://github.com/NoHomey/material-ui-number-input/blob/master/example/index.tsx))

# Supports propTypes for regular JavaScript users
