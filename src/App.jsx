import Header from './Header';
import MetroLineViewer from './MetroLineViewer';

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