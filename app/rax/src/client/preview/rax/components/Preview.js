/* eslint-disable import/no-extraneous-dependencies */
import { createElement, Component, PropTypes } from 'rax';
import addons from '@storybook/addons';
import Events from '@storybook/core-events';
import View from 'rax-view';
import Text from 'rax-text';

class PreviewApp extends Component {
  static propTypes = {
    storyStore: PropTypes.shape({}).isRequired,
    renderContent: PropTypes.func.isRequired,
    context: PropTypes.shape({}).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      selection: {},
      revision: -1,
      error: null,
    };

    this.handleStoryRender = this.handleStoryRender.bind(this);
    this.handleStoryReRender = this.handleStoryReRender.bind(this);
    this.showError = this.showError.bind(this);
  }

  componentDidMount() {
    const { storyStore } = this.props;
    const channel = addons.getChannel();

    storyStore.on(Events.STORY_RENDER, this.handleStoryRender);
    channel.on(Events.FORCE_RE_RENDER, this.handleStoryReRender);
  }

  componentWillUnmount() {
    const { storyStore } = this.props;
    const channel = addons.getChannel();

    storyStore.off(Events.STORY_RENDER, this.handleStoryRender);
    channel.off(Events.FORCE_RE_RENDER, this.handleStoryReRender);
  }

  showError(error) {
    this.setState({
      error,
    });
  }

  handleStoryReRender() {
    this.handleStoryRender(true);
  }

  handleStoryRender(forceReRender = false) {
    const { storyStore } = this.props;
    const { selection, revision } = this.state;
    const nextSelection = storyStore.getSelection();
    const nextRevision = storyStore.getRevision();
    const channel = addons.getChannel();

    if (
      !forceReRender &&
      selection.kind === nextSelection.kind &&
      selection.name === nextSelection.name &&
      revision === nextRevision
    ) {
      channel.emit(Events.STORY_UNCHANGED, nextSelection.id);
      return;
    }

    if (!forceReRender && selection && revision) {
      channel.emit(Events.STORY_CHANGED, nextSelection.id);
    }

    this.setState({
      selection: nextSelection,
      revision: nextRevision,
    });
  }

  renderStory() {
    const { renderContent, context } = this.props;
    const { selection, error } = this.state;
    const { getDecorated, kind, name } = selection;

    if (error) {
      return (
        <View>
            <Text>{error.title}</Text>
            <Text>{error.description}</Text>
        </View>
      );
    }

    if (getDecorated) {
      return renderContent({
        ...context,
        ...selection,
        showError: this.showError,
        selectedKind: kind,
        selectedStory: name,
      });
    }

    return (
      <View>
        <Text>No Preview at all</Text>
      </View>
    );
  }

  render() {
    return <View>{this.renderStory()}</View>;
  }
}

export default PreviewApp;
