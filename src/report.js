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

    const html = completion.map(c => `<p>${c.name}: ${c.y}</p>`).join('');
    $('#report').html(html);
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
