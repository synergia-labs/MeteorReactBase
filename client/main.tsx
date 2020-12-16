import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { App } from '/imports/ui/App';
//import 'semantic-ui-css/semantic.css'; //Default Theme ONly
import '../imports/semanticui/dist/semantic.min.css';
import './serviceWorker';
Meteor.startup(() => {
  render(<App/>, document.getElementById('react-target'));
});
