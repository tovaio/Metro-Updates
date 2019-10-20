import Header from './Header';
import MetroLineViewer from './MetroLineViewer';
require('./App.css');

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Header />
                <MetroLineViewer />
            </div>
        );
    }

}

export default App;