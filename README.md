# material-ui-number-input

The better TextField for number inputs.

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
| defaultValue            | *number*   |           | *true*    | The number to use for the default value. Must be in range [min, max] if any is setted. |
| strategy             | *'ignore' \| 'warn' \| 'allow'* | *'allow'* | *false* | Strategy to use when user presses key and when value prop change it's value. |
| min                     | *number*   |           | *false*   | The number used as minimum value limit. Must be less than max. |
| max                     | *number*   |           | *false*   | The number used as maximum value limit. Must be greater than min. |
| reqired                 | *bool*     | *false*   | *false*   | If true and if input is left empty than instead of 'clean', 'required' error will be emited throughout onError handler if useStrategy is not 'ignore'. |
| value                   | *string*   |           | *true*   | The value of the input field. |
| onChange                | *function* |           | *true*   | Callback function that is fired when input filed must change it's value. **Signature:** `function(event: React.FormEvent, value: string) => void`. |
| onError           | *function* |         | *false*   | Callback function that is fired when input error status changes.  **Signature:** `function(error: 'none' | 'invalidSymbol' | 'incompleteNumber' | 'singleMinus' | 'singleFloatingPoint' | 'singleZero' | 'min' | 'max' | 'required' | 'clean') => void`. |
| onValid                 | *function*|            | *false*   | Callback function that is fired when input's value is a valid number ('none' error was catched).  **Signature:** `function(value: number) => void` |
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

# Strategies

## 'ignore'

When `srategy` is `'ignore'` `onError` is never called. Internally catches `'none'`, `'incompleteNumber'`, `'clean'` and `'required'` errors to allow valid numbers only to be entered. All other errors are prevented from ocurring when user types in the input field, but not when `value` prop is changed other than after call from `onChange`. In all cases when `value` is setted with `string` which would generate error other than the pointed errors input value will be cleared including the intial value.

## 'warn'

When `strategy` is `'warn'` `onError` will be always called with catched error but when error other than `'none'`, `'incompleteNumber'`, `'clean'` and `'required'` occures `preventDefault` will be called on the `KeyboardEvent`  when `onKeyDown` is fired and the event will be trapped so no calls to `onKeyDown`, `onKeyUp`, `onKeyPress` and `onChange` will be delegated. Manually setting `value` with `string` that will generate error other than the pointed won't stop input value from change.

## 'allow'

When `strategy` is `'allow'` no error is prevented from changing input's value and all are emitted with call to `onError`. This is the default strategy.

# Errors

## 'none'

Fired when input's value is valid (there is no error).

## 'required'

Fired when `required` prop is `true` and user leaves empty the input or it gets cleared.

## 'clean'

Fired when `required` prop is `false` and user leaves empty the input or it gets cleared.

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

# public methods

`NumberInput` re-exposes public method `getInputNode(): HTMLInputElement` from `TextField`.

`TextField` methods: `blur`, `focus`, `select` and `getValue` are not exposed as they and `getInputNode` will be removed in material-ui 0.16 and replaced with public member `input` which is public and now but `getInputNode` is prefered until 0.16 is released. If you want to use any of those methods call them on input retunrned from `getInputNode` with the excpetion of `getValue` instead use `value` property.

# Example

```js
import * as React from 'react';
import NumberInput from 'material-ui-number-input';

class Demo extends React.Component {
  constructor(props) {
  super(props);
  this.state = { value: '12.' };
  
  this.onKeyDown = (event) => {
    console.log(`onKeyDown ${event.key}`);
  };
  
  this.onChange = (event, value) => {
    const e = event;
    console.log(`onChange ${e.target.value}, ${value}`);
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
      this.setState({ errorText: errorText });
    };
    this.onValid = (value) => {
      console.debug(`${value} is a valid number`);
    };
  }
    
  componentDidMount() {
    this.onError('required');
  }
    
  render() {
    const { state, onChange, onError, onKeyDown, onValid } = this;
    const { value, errorText } = state;  
    return (
      <NumberInput
        id="num"
        required
        defaultValue={9}
        min={-10}
        max={12}
        value={value}
        strategy="warn"
        errorText={errorText}
        onValid={onValid}
        onChange={onChange}
        onError={onError}
        onKeyDown={onKeyDown} />
    );
  }
}
```

# Written in Typescript and Typescript Ready! ([check example](https://github.com/NoHomey/material-ui-number-input/blob/master/example/index.tsx))

# Supports propTypes for regular JavaScript users

# Testing

## Tests will be added soon

# Contributing

1. Fork the repository
2. `npm install`
3. `npm run typings`
4. Make changes
5. `npm start`
6. open `http://localhost:3000`
7. Make a Pull Request

