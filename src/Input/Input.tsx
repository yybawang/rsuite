import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { FormGroupContext } from '../FormGroup/FormGroup';
import { InputGroupContext } from '../InputGroup/InputGroup';
import Plaintext from '../Plaintext';
import { createChainedFunction, TypeChecker, mergeRefs, useClassNames, KEY_VALUES } from '../utils';
import {
  WithAsProps,
  RsRefForwardingComponent,
  TypeAttributes,
  FormControlBaseProps
} from '../@types/common';
import { PrependParameters } from '../@types/utils';

export interface LocaleType {
  unfilled: string;
}

export interface InputProps
  extends WithAsProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'>,
    Omit<FormControlBaseProps, 'onChange'> {
  /** The HTML input type */
  type?: string;

  /** The HTML input id */
  id?: string;

  /** A component can have different sizes */
  size?: TypeAttributes.Size;

  /** Ref of input element */
  inputRef?: React.Ref<any>;

  onChange?: PrependParameters<React.ChangeEventHandler<HTMLInputElement>, [value: string]>;

  /** Called on press enter */
  onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;
}

/**
 * The `<Input>` component is used to get user input in a text field.
 * @see https://rsuitejs.com/components/input
 */
const Input: RsRefForwardingComponent<'input', InputProps> = React.forwardRef(
  (props: InputProps, ref) => {
    const {
      className,
      classPrefix = 'input',
      as: Component = 'input',
      type = 'text',
      disabled,
      value,
      defaultValue,
      inputRef,
      id,
      size,
      plaintext,
      readOnly,
      onPressEnter,
      onFocus,
      onBlur,
      onKeyDown,
      onChange,
      ...rest
    } = props;

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === KEY_VALUES.ENTER) {
          onPressEnter?.(event);
        }
        onKeyDown?.(event);
      },
      [onPressEnter, onKeyDown]
    );

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event.target?.value, event);
      },
      [onChange]
    );

    const { withClassPrefix, merge } = useClassNames(classPrefix);
    const classes = merge(className, withClassPrefix(size, { plaintext }));
    const inputGroupContext = useContext(InputGroupContext);
    const formGroupContext = useContext(FormGroupContext);

    // Make the Input component display in plain text,
    // and display default characters when there is no value.
    if (plaintext) {
      return (
        <Plaintext ref={ref} localeKey="unfilled">
          {typeof value === 'undefined' ? defaultValue : value}
        </Plaintext>
      );
    }

    const operable = !disabled && !readOnly;
    const eventProps: React.HTMLAttributes<HTMLInputElement> = {};

    if (operable) {
      eventProps.onChange = handleChange;
      eventProps.onKeyDown = handleKeyDown;
      eventProps.onFocus = createChainedFunction(onFocus, inputGroupContext?.onFocus);
      eventProps.onBlur = createChainedFunction(onBlur, inputGroupContext?.onBlur);
    }

    return (
      <Component
        {...rest}
        {...eventProps}
        ref={mergeRefs(ref, inputRef)}
        className={classes}
        type={type}
        id={id || formGroupContext?.controlId}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        readOnly={readOnly}
      />
    );
  }
);

Input.displayName = 'Input';
Input.propTypes = {
  type: PropTypes.string,
  as: PropTypes.elementType,
  id: PropTypes.string,
  classPrefix: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  size: PropTypes.oneOf(['lg', 'md', 'sm', 'xs']),
  inputRef: TypeChecker.refType,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onPressEnter: PropTypes.func
};
export default Input;
