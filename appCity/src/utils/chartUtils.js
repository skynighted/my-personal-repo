import { Line, Pie, Column } from '@antv/g2plot'

export class ChartUtils {
    static createLineChart(container, data, options = {}) {
        const defaultOptions = {
            data,
            xField: 'date',
            yField: 'value',
            label: {
                style: {
                    fill: 'white'
                }
            },
            xAxis: {
                label: {
                    rotate: -45,
                    style: {
                        fill: 'white',
                        fontSize: 12,
                    }
                }
            },
            yAxis: {
                label: {
                    style: {
                        fill: 'white',
                        fontSize: 12,
                    }
                }
            },
            smooth: true,
            point: {
                size: 3,
                shape: 'circle',
            },
            tooltip: {
                domStyles: {
                    "g2-tooltip": {
                        background: '#147',
                        color: 'white',
                        fontSize: 14
                    }
                },
                showMarkers: true
            },
            ...options
        }

        return new Line(container, defaultOptions)
    }

    static createPieChart(container, data, options = {}) {
        const defaultOptions = {
            data,
            angleField: 'value',
            colorField: 'type',
            radius: 0.8,
            label: {
                style: {
                    fill: 'white'
                },
                type: 'outer',
                content: '{name} {value}个',
            },
            interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
            color: ({ type }) => {
                if (type === '在线') return '#a2a6e2'
                return 'pink'
            },
            legend: {
                itemName: {
                    style: {
                        fill: 'white'
                    },
                }
            },
            statistic: {
                title: {
                    style: {
                        fill: 'white'
                    }
                },
                content: {
                    style: {
                        fill: 'white'
                    }
                }
            },
            ...options
        }

        return new Pie(container, defaultOptions)
    }

    static createColumnChart(container, data, options = {}) {
        const defaultOptions = {
            data,
            xField: 'name',
            yField: 'value',
            label: {
                style: {
                    fill: 'white'
                }
            },
            xAxis: {
                label: {
                    style: {
                        fill: 'white',
                        fontSize: 8,
                    },
                    autoRotate: false
                }
            },
            yAxis: {
                label: {
                    style: {
                        fill: 'white',
                        fontSize: 10,
                    }
                }
            },
            ...options
        }

        return new Column(container, defaultOptions)
    }
}