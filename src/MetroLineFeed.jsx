import TweetEmbed from 'react-tweet-embed';
import request from 'browser-request';
import url from 'url';

class MetroLineFeed extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        tweets: []
    };

    cache = {};

    componentDidMount() {
        this.retrieveTweets();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.metroIndex != this.props.metroIndex || prevProps.lineIndex != this.props.lineIndex) {
            this.retrieveTweets();
        }
    }

    retrieveTweets = () => {
        const metroIndex = this.props.metroIndex;
        const lineIndex = this.props.lineIndex;

        if (metroIndex in this.cache && lineIndex in this.cache[metroIndex]) {
            console.log('found cached!');
            this.setState({
                tweets: this.cache[metroIndex][lineIndex]
            });
            return;
        } else if (!(metroIndex in this.cache)) {
            this.cache[metroIndex] = {};
        }

        request.get({
            uri: url.resolve(location.href, `/filter?metroIndex=${metroIndex}&lineIndex=${lineIndex}`),
        }, (err, res, body) => {
            if (err) {
                reject(err);
            } else {
                const tweetIDs = JSON.parse(body)['tweetIDs'];
                const tweets = tweetIDs.map((tweetID) => {
                    return (
                        <TweetEmbed key={tweetID} id={tweetID} />
                    );
                });
                this.cache[metroIndex][lineIndex] = tweets;
                this.setState({
                    tweets: tweets
                });
            }
        });
    }

    render() {
        return (
            <div id='tweets'>
                {this.state.tweets}
            </div>
        );
    }

}

export default MetroLineFeed;