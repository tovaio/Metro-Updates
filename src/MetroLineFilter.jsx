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

        const metroIconSrc = metros[parseInt(this.props.value)]['icon'];

        return (
            <div className='entry'>
                <p>metro: </p>
                <select value={this.props.value} onChange={(e) => this.props.onChange(e, 'metro')}>{options}</select>
                <img id='metroIcon' src={metroIconSrc}/>
            </div>
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

        const iconStyle = {
            backgroundColor: lines[parseInt(this.props.value)]['color']
        };

        return (
            <div className='entry'>
                <p>line: </p>
                <select value={this.props.value} onChange={(e) => this.props.onChange(e, 'line')}>{options}</select>
                <div id='lineIcon' style={iconStyle}></div>
            </div>
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
            this.props.onChange(e.target.value, '0');
        } else {
            this.props.onChange(this.state.metro, e.target.value);
        }
    }

    render() {
        return (
            <form id='metroLineFilter'>
                <MetroSelector value={this.state.metro} onChange={this.handleChange}/>
                <LineSelector metro={this.state.metro} value={this.state.line} onChange={this.handleChange}/>
            </form>
        )
    }

}

export default MetroLineFilter;