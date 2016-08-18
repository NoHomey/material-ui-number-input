# Change Log

## [v2.0.0](https://github.com/NoHomey/material-ui-number-input/releases/tag/2.0.0)

### Properties

- `value` is now of type 'string'
- `onChange` changed signature to `function (event: React.FormEvent, value: string, complete: boolean) => void`
- `error` is new prop of type `React.PropTypes.oneOf(['none', 'invalidSymbol', 'incompleteNumber', 'singleMinus', 'singleFloatingPoint', 'singleZero', 'min', 'max', 'required'])` and it's the controlled error so `onError` can be called only when error changes. Default value is `'none'`

### Changes

- replacing state double with controlled input
- `value` is now watched for changes
- `onChange` is now called every time when input value must change, third argument provides infomration is value a complete number.

### Bug fixes

- `onKeyDown` is now called when `.` and `-` are pressed and emitted error is `'incompleteNumber'`

### Implementation

- `shouldComponentUpdate` is now not overrided

## [v3.0.0](https://github.com/NoHomey/material-ui-number-input/releases/tag/3.0.0)

### Properties

#### Deprecated

- `showDefaultValue`
- `error`

#### New

- `defaultValue` is of type `number` and is the same as `TextField` and `input` `defaultValue` prop
- `onValid`is function with signature `function(value: number) => void` called when input's value is a valid number
- `useStrategy` is of type `React.PropTypes.oneOf(['ignore', 'warn', 'allow'])` with defualt value `'allow'` and sets used error strategy refer to [Strategy](https://github.com/NoHomey/material-ui-number-input#strategies) and [Errors](https://github.com/NoHomey/material-ui-number-input#errors) 

#### Changed

- `onError` signature changed to `function(event: React.FromEvent, value: string) => void`
- `onChange` signature changed to `function(error: 'none' | 'invalidSymbol' | 'incompleteNumber' | 'singleMinus' | 'singleFloatingPoint' | 'singleZero'| 'min' | 'max' | 'required' | 'clean';) => void`

### Errors

- `'clean'` equivalent of `'required'` when `required` prop is `false`

### Implementation

- `error` is moved from `props` to `state`
