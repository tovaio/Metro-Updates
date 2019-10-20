import MetroLineFilter from './MetroLineFilter';
import MetroLineFeed from './MetroLineFeed';

class MetroLineViewer extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        metroIndex: '0',
        lineIndex: '0'
    };

    handleChange = (metro, line) => {
        this.setState({
            metroIndex: metro,
            lineIndex: line
        });
    }

    render() {
        return (
            <div>
                <MetroLineFilter onChange={this.handleChange} />
                <MetroLineFeed metroIndex={this.state.metroIndex} lineIndex={this.state.lineIndex} />
            </div>
        );
    }

}

export default MetroLineViewer;