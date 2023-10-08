/*
* 封装的饼图
* @zjf-2021-06-30
* */
import React, { Component, Fragment } from 'react';
// eslint-disable-next-line no-unused-vars
import global from '@/global.less';
import DataSet from '@antv/data-set';
import {noDataPlaceholder} from '@/utils/utils';
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Label,
    Legend
} from 'bizcharts';

export default class Pie extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cols: {
                month: {
                    range: [0, 1]
                }
            },
            pieData: props.data,
            dv: '',
            colsPie: {
                percent: {
                    formatter: val => {
                        val = `${(val * 100).toFixed(2) }%`;
                        return val;
                    }
                }
            }
        };
    }


    componentDidMount() {
        this.initData();
    }

    componentWillReceiveProps(nextProps) {
        let _this = this;
        if(JSON.stringify(nextProps.data) != JSON.stringify(this.props.data)){
            this.setState({ pieData: nextProps.data }, () => {
                _this.initData();
            });
        }
    }

  initData = () => {
      let { pieData } = this.state;
      const { DataView } = DataSet;
      let dv = new DataView();
      if (pieData.length > 0) {
          dv.source(pieData).transform({
              type: 'percent',
              field: 'count',
              dimension: 'item',
              as: 'percent'
          });
      } else {
          dv = '';
      }

      this.setState({
          dv
      });
  };

  render() {
      const { colsPie, dv } = this.state;
      return (
          <Fragment>
              {dv ? <Chart
                  data={dv}
                  scale={colsPie}
                  padding={[20, 100, 30, 0]}
                  forceFit
                  onGetG2Instance={c => {
                      // eslint-disable-next-line no-shadow
                      function getXY(c, { index: idx = 0, field = 'percent', radius = 0.5 }) {
                          const d = c.get('data');

                          if (idx > d.length) {return;}
                          const scales = c.get('scales');
                          let sum = 0;
                          for (let i = 0; i < idx + 1; i++) {
                              let val = d[i][field];
                              if (i === idx) {
                                  val = val / 2;
                              }
                              sum += val;
                          }
                          const pt = {
                              y: scales[field].scale(sum),
                              x: radius
                          };
                          const coord = c.get('coord');
                          let xy = coord.convert(pt);
                          return xy;
                      }

                      const xy = getXY(c, { index: 0 });
                      c.showTooltip(xy);
                  }}
              >
                  <Coord type="theta" radius={0.75} />
                  <Axis name="percent" />
                  <Legend
                      position="right-top"
                      offsetY={107}
                      offsetX={-68}
                      allowAllCanceled
                  />
                  <Tooltip
                      itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
                      g2-tooltip={{
                          backgroundColor: 'black',
                          color: '#fff',
                          opacity: '0.8'
                      }}

                  />
                  <Geom
                      type="intervalStack"
                      position="percent"
                      color="item"
                      tooltip={[
                          'item*percent*count',
                          (item, percent,count) => ({
                              title:'销售额',
                              name: item,
                              value: `<span style="margin-right: 8px;margin-left: 12px;">￥${count.toFixed(2)}</span>${(percent*100).toFixed(2)}%`
                          })
                      ]}
                      style={{
                          lineWidth: 1,
                          stroke: '#fff'
                      }}
                  >
                      <Label
                          content="percent"
                          formatter={(val, item) => `${item.point.item }: ${ val}`}
                      />
                  </Geom>
              </Chart> : noDataPlaceholder()}
          </Fragment>
      );
  }
}
