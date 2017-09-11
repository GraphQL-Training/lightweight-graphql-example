const MOCK_DATA = {
  currentUser: {
    name: 'Benjie',
    website: 'https://graphile.org',
  },
};

const Header = ({currentUser}) => (
  <nav className='navbar navbar-expand-lg navbar-light bg-light'>
    <a className='navbar-brand' href='/'>
      MyWebsite
    </a>
    <a className='ml-auto'>
      {currentUser.name}
    </a>
  </nav>
);

class SettingsPage extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentWillMount() {
    this.setState({
      name: this.props.currentUser.name,
      website: this.props.currentUser.website,
    });
  }
  handleWebsiteChange = e => this.setState({website: e.target.value});
  handleNameChange = e => this.setState({name: e.target.value});
  saveUser = (e) => {
    e.preventDefault();
    console.log("TODO: save currentUser")
  };
  render() {
    const {currentUser} = this.props;
    return (
      <section className='container'>
        <h2 className='mt-5'>Settings</h2>
        <form onSubmit={this.saveUser}>
          <div className="form-group">
            <label>Name</label>
            <input
              className="form-control"
              onChange={this.handleNameChange}
              value={this.state.name}
            />
          </div>
          <div className="form-group">
            <label>Website</label>
            <input
              className="form-control"
              placeholder="https://"
              onChange={this.handleWebsiteChange}
              value={this.state.website}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </form>
      </section>
    );
  }
}

const Layout = ({currentUser}) => (
  <div>
    <Header currentUser={currentUser} />
    <SettingsPage currentUser={currentUser} />
  </div>
);

const el = document.getElementById('react');
ReactDOM.render(<Layout {...MOCK_DATA} />, el);
