const Header = ({currentUser}) => (
  <nav className='navbar navbar-expand-lg navbar-light bg-light'>
    <a className='navbar-brand' href='/'>
      MyWebsite
    </a>
    {
      currentUser
      ?
        <a className='ml-auto'>
          {currentUser.name}
        </a>
      :
        <a className='ml-auto' href='#login'>
          Log in
        </a>
    }
  </nav>
);

class SettingsPage extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentWillMount() {
    if (this.props.currentUser) {
      this.setState({
        name: this.props.currentUser.name,
        website: this.props.currentUser.website,
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.name === undefined && nextProps.currentUser) {
      this.setState({
        name: nextProps.currentUser.name,
        website: nextProps.currentUser.website,
      });
    }
  }
  handleWebsiteChange = e => this.setState({website: e.target.value});
  handleNameChange = e => this.setState({name: e.target.value});
  saveUser = (e) => {
    e.preventDefault();
    console.log("TODO: save currentUser")
  };
  renderLogIn() {
    return (
      <section className='container'>
        <h2 className='mt-5'>Login Required</h2>
        <p>To access the settings page you must first <a href='#login'>log in</a></p>
      </section>
    );
  }
  render() {
    const {currentUser} = this.props;
    if (!currentUser) {
      return this.renderLogIn();
    }
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

const Layout = ({ loading, data: { currentUser } = {} }) => (
  loading
  ?
    <div className="progress">
      <div className="progress-bar progress-bar-striped progress-bar-animated"  role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{width: "100%"}} />
    </div>
  :
    <div>
      <Header currentUser={currentUser} />
      <SettingsPage currentUser={currentUser} />
    </div>
);

const withGraphQLResult = query => Component => class extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
    };
  }
  componentDidMount() {
    this.fetch();
  }
  async fetch() {
    try {
      const result = await window.fetch("/graphql", {
        method: 'POST',
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify({
          query,
          variables: {},
        }),
      });
      const json = await result.json();
      this.setState({loading: false, data: json.data});
    } catch (e) {
      this.setState({loading: false, error: e});
    }
  }
  render() {
    return <Component loading={this.state.loading} data={this.state.data} error={this.state.error} />;
  }
};

const Root = withGraphQLResult(`{ currentUser { id, name, website } }`)(Layout);

const el = document.getElementById('react');
ReactDOM.render(<Root />, el);
