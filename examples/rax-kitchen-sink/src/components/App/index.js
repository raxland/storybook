import { createElement, Component } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Button from 'rax-button';
import styles from './index.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      changed: 'To get started, edit src/components/App.js and save to reload.',
    };
    this.handleClick = this.handleClick.bind(this);
  }

  get text() {
    const { changed } = this.state;
    return changed
      ? 'Yay! thank you'
      : 'To get started, edit src/components/App.js and save to reload.';
  }

  get buttonText() {
    const { changed } = this.state;
    return changed ? 'Back to default' : 'Change text';
  }

  handleClick() {
    const { changed } = this.state;
    this.setState({
      changed: !changed,
    });
  };

  render() {
    return (
      <View style={styles.app}>
        <View style={styles.appHeader}>
          <Text style={styles.appBanner}>Welcome to Rax</Text>
        </View>
        <Button style={styles.button} onPress={this.handleClick}>
          <Text style={styles.buttonText}>{this.buttonText}</Text>
        </Button>
        <Text style={styles.appIntro}> {this.text} </Text>
      </View>
    );
  }
}

export default App;
