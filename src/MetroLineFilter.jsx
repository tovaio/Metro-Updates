const metroLines = require('./metroLines.json');

class MetroSelector extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const metros = metroLines['metros'];

        const options = metros.map((metro, metroIndex) => (
            <option key={metroIndex.toString()} value={metroIndex.toString()}>{`${metro['name']} (${metro['city']})`}</option>
        ));

        return (
            <select value={this.props.value} onChange={(e) => this.props.onChange(e, 'metro')}>{options}</select>
        );
    }

}

class LineSelector extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const metro = metroLines['metros'][parseInt(this.props.metro)];
        const lines = metro['lines'];

        const options = lines.map((line, lineIndex) => (
            <option key={lineIndex.toString()} value={lineIndex.toString()}>{line['name']}</option>
        ));

        return (
            <select value={this.props.value} onChange={(e) => this.props.onChange(e, 'line')}>{options}</select>
        );
    }

}

class MetroLineFilter extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        metro: '0',
        line: '0'
    };

    handleChange = (e, type) => {
        this.setState({
            [type]: e.target.value
        });
        if (type == 'metro') {
            this.setState({
                line: '0'
            });
        }
    }

    handleSubmit = (e) => {
        alert(`Filtering by metro ${this.state.metro} and line ${this.state.line}!`);
        e.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <MetroSelector value={this.state.metro} onChange={this.handleChange}/>
                <LineSelector metro={this.state.metro} value={this.state.line} onChange={this.handleChange}/>
                <input type='submit' value='Filter!' />
            </form>
        )
    }

}

export default MetroLineFilter;