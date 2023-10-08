import * as React from 'react';

export interface ITrendProps {
  colorful?: boolean;
  flag: 'up' | 'down';
  style?: React.CSSProperties;
  reverseColor?: boolean;
}

// eslint-disable-next-line react/prefer-stateless-function
export default class Trend extends React.Component<ITrendProps, any> {}
