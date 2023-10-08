import * as React from 'react';

export interface ITagSelectOptionProps {
  value: string | number;
  style?: React.CSSProperties;
}

// eslint-disable-next-line react/prefer-stateless-function
export default class TagSelectOption extends React.Component<ITagSelectOptionProps, any> {}
