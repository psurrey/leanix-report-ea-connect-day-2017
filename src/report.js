export class Report {

  constructor(setup) {
    this.setup = setup;
  }

  createConfig() {
    return {
      facets: [{
        attributes: ['id', 'type'],
        callback: this.render.bind(this)
      }]
    };
  }

  render(data) {
    const html = data.map(fs => `<p>${fs.type}: ${fs.id}</p>`).join('');
    $('#report').html(html);
  }

}
