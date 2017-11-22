import * as Highcharts from 'highcharts';

const RELATION_FRAGMENT = `
  relUserGroupToApplication {
    edges {
      node {
        factSheet { displayName completion { percentage } }
      }
    }
  }
`;

export class Report {

  constructor(setup) {
    this.setup = setup;
  }

  createConfig() {
    return {
      facets: [{
        fixedFactSheetType: 'UserGroup',
        attributes: ['id', 'type', 'displayName', RELATION_FRAGMENT],
        callback: this.render.bind(this)
      }]
    };
  }

  render(data) {
    let completion = this.computeAverageCompletion(data);
    completion = completion.sort((a,b) => b.y - a.y);
    this.createHighchart(completion);
  }

  createHighchart(completion) {
    const categories = completion.map((item) => item.name);
    const options = this.buildHighchartsOptions(categories, completion);
    Highcharts.chart('report', options);
  }

  buildHighchartsOptions(categories, completion) {
    return {
      chart: {
        events: {},
        type: 'bar',
        plotBackgroundColor: null,
        plotBorderWidth: null,
      },
      plotOptions: {
        series: {
          allowPointSelect: false,
          events: {
            legendItemClick: function() { return false; }
          }
        }
      },
      tooltip: {
        formatter: function() {
          return '<b>'+ this.x +'</b>: '+ Highcharts.numberFormat(this.y, 2) +'%';
      }
      },
      xAxis: {
        categories,
        tickInterval: null,
        startOnTick: false,
        labels: {
          step: 1
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Average completion'
        }
      },
      title: false,
      series: [{
        data: completion,
        name: 'Completion'
      }]
    }
  }

  computeAverageCompletion(data) {
    return data.map((userGroup) => {
      return {
        name: userGroup.displayName,
        y: this.computeUserGroupCompletion(userGroup)
      };
    });
  }

  computeUserGroupCompletion(userGroup) {
    let completion = 0;
    if(userGroup.relUserGroupToApplication.edges.length > 0) {
      completion = userGroup.relUserGroupToApplication.edges.reduce((sum, val) => {
        return sum + val.node.factSheet.completion.percentage;
      }, 0.0);
      completion = completion / userGroup.relUserGroupToApplication.edges.length;
    }
    return completion;
  }

}
