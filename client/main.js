const HeaderProfileLink = ({currentUser: {name, avatarUrl}}) => (
  <a className='ml-auto'>
    {avatarUrl
    ? <img className="rounded-circle mr-2" src={avatarUrl} width="32" height="32" />
    : null
    }
    {name}
  </a>
);

HeaderProfileLink.HeaderProfileLinkUserFragment = `
fragment HeaderProfileLinkUserFragment on User {
  name
  avatarUrl
}
`;

const Header = ({currentUser}) => (
  <nav className='navbar navbar-expand-lg navbar-light bg-light'>
    <a className='navbar-brand' href='/'>
      MyWebsite
    </a>
    {
      currentUser
      ?
        <HeaderProfileLink currentUser={currentUser} />
      :
        <a className='ml-auto' href='#login'>
          Log in
        </a>
    }
  </nav>
);

Header.HeaderUserFragment = `
fragment HeaderUserFragment on User {
  id
  ...HeaderProfileLinkUserFragment
}
${HeaderProfileLink.HeaderProfileLinkUserFragment}
`;

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

SettingsPage.SettingsPageUserFragment = `
fragment SettingsPageUserFragment on User {
  id
  name
  website
}
`;

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

async function executeGraphQLQuery(query, variables = {}) {
  const response = await window.fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      query: query,
      variables: variables
    })
  });
  if (!response.ok) {
    const err = new Error("GraphQL query failed");
    err.status = response.status;
    throw err;
  }
  return await response.json();
}

const withGraphQLResult = (query, { variables } = {}) => Component =>
  class extends React.Component {
    state = { loading: true };
    componentDidMount() { this.fetch(); }
    async fetch() {
      try {
        const json = await executeGraphQLQuery(query, variables);
        this.setState({ loading: false, error: null, data: json.data });
      } catch (e) {
        this.setState({ loading: false, error: e });
      }
    }
    render() {
      return <Component
        loading={this.state.loading}
        data={this.state.data}
        error={this.state.error}
      />;
    }
  };

const Root = withGraphQLResult(`
query SettingsPageRootQuery {
  currentUser {
    ...HeaderUserFragment
    ...SettingsPageUserFragment
  }
}

${Header.HeaderUserFragment}
${SettingsPage.SettingsPageUserFragment}
`)(Layout);

const el = document.getElementById('react');
ReactDOM.render(<Root />, el);
