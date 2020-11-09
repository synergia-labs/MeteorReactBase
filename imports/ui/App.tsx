import React from 'react';
import AppLayoutFixedMenu from './layouts/AppLayoutFixedMenu.tsx';
import GeneralComponents from './AppGeneralComponents';

export const App = () => (
    <GeneralComponents
        render={(props)=><AppLayoutFixedMenu {...props} />}
    />

    );
