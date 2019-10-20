import MetroLineFilter from './MetroLineFilter';
import MetroLineFeed from './MetroLineFeed';

class MetroLineViewer extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        filterQuery: null
    };

    handleSubmit = (filterQuery) => {
        this.setState({
            filterQuery: filterQuery
        });
    }

    render() {
        return (
            <div>
                <MetroLineFilter onSubmit={this.handleSubmit}/>
                <MetroLineFeed filterQuery={this.state.filterQuery}/>
            </div>
        );
    }

}

export default MetroLineViewer;