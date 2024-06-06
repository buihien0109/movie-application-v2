import React from 'react';
import EpisodeTable from './EpisodeTable';

function EpisodeList(props) {
    return (
        <>
            <EpisodeTable {...props} />
        </>
    )
}

export default EpisodeList