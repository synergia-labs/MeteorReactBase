// region Imports
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';
import { ApiBase } from '../../../api/base';
import { exampleSch } from './exampleSch';
import { getUser } from '../../../libs/getUser';
import settings from '../../../../settings.json';

// endregion

class ExampleApi extends ApiBase {
  constructor(props) {
      super('example', exampleSch)
    }

}

export const exampleApi = new ExampleApi();
