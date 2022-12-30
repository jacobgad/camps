import { forwardRef, useState } from "react";
import type { ButtonProps } from "./Button";
import Button from "./Button";
import type { InputProps } from "./Input";
import Input from "./Input";

type Ref = HTMLInputElement;

type Props = {
  buttonProps: ButtonProps;
} & Omit<InputProps, "ref">;

export default forwardRef<Ref, Props>(function ButtonField(
  { buttonProps, ...inputProps },
  ref
) {
  const [show, setShow] = useState(!!inputProps.value);

  return (
    <>
      {show ? (
        <Input ref={ref} {...inputProps} />
      ) : (
        <Button
          intent="secondary"
          size="small"
          {...buttonProps}
          onClick={(e) => {
            setShow(true);
            buttonProps.onClick && buttonProps.onClick(e);
          }}
        />
      )}
    </>
  );
});
