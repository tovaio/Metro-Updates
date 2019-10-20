class Title extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <p id='title'>
                {this.props.children}
                <p id='titleTop'>
                    {this.props.children}
                </p>
            </p>
        )
    }

}

class Header extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div id='header'>
                    <Title>metro updates</Title>
                </div>
                <p id='desc'>
                    stay updated on your commute by viewing recent alerts on your preferred metro line!
                </p>
            </>
        );
    }

}

export default Header;