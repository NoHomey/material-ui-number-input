# Change Log

## [v2.0.0](https://github.com/NoHomey/react-material-ui-keyboard/releases/tag/2.0.0)

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
