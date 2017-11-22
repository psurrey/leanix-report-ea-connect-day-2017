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
    const html = data.map(fs => `<p>${fs.type}: ${fs.displayName}<div>${this.renderRelations(fs)}</div></p>`).join('');
    $('#report').html(html);
  }

  renderRelations(fs) {
    return fs.relUserGroupToApplication.edges.map(e => e.node.factSheet.displayName).join('<br>');
  }

}
