import React from 'react';
import SelectInner, { Props as SelectInnerProps } from 'react-select';

export type SelectProps<OptionType, IsMulti extends boolean = false> = SelectInnerProps<
  OptionType,
  IsMulti
> & {
  containerClassName?: string;
};

const SelectComponent = <OptionType, IsMulti extends boolean = false>(
  props: SelectProps<OptionType, IsMulti>,
) => {
  const { containerClassName, ...rest } = props;

  return (
    <div className={containerClassName}>
      <SelectInner {...rest} />
    </div>
  );
};

const Select = React.memo(SelectComponent) as typeof SelectComponent;

export default Select;
