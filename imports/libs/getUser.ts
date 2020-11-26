import shortid from 'shortid';
import {Meteor} from 'meteor/meteor';

export const userprofileData = {

}

/**
 * Return Logged User if exists.
 * @return {Object} Logged User
 */
export const getUser = (userDoc:object, connection: { id:string }):object => {

    if (userDoc) {
        return userDoc;
    }

    if (Meteor.isClient && Meteor.status().status !== 'connected') {
        if (!!window && !!window.$app && !!window.$app.user) {
            return window.$app.user;
        }

    }



    try {
        if(!userprofileData.collectionInstance) {
            console.log('UserProfile Collection not Avaliable');
            return Meteor.user();
        }
        const userProfile = userprofileData.collectionInstance.findOne(
            {email: Meteor.user().profile.email});

        if (userProfile) {
            return userProfile;
        }

        const d = new Date();
        const simpleDate = `${d.getFullYear()}${d.getMonth() + 1}${d.getDay()}`;
        const id = connection && connection.id ? simpleDate + connection.id : shortid.generate();

        return ({
            id,
            _id: id,
            roles: ['Public'],
        });
    } catch (e) {
        const d = new Date();
        const simpleDate = `${d.getFullYear()}${d.getMonth() + 1}${d.getDay()}`;
        const id = connection && connection.id ? simpleDate + connection.id : shortid.generate();
        return ({
            id,
            _id: id,
            roles: ['Public'],
        });
    }
};
