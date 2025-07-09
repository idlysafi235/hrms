import React from 'react';
import './DownloadButton.css';

import { MdDownload } from 'react-icons/md'

function DownloadButton (props) {
    return (
        <a href={props.url} className="download-button osns" target="_blank" rel="noopener noreferrer">
            <button><MdDownload /> {props.name}</button>
        </a> 
    )
};

export default DownloadButton;