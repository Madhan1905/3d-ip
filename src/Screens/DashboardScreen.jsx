import React, { useRef } from 'react';
import SideNavComponent from '../Components/SideNavComponent';

const DashboardScreen = (props) => {
    const inputRef = useRef(null);

    return (
        <div style={{ display: 'flex' }}>
            <SideNavComponent {...props} />
            <main className='main-body'>
                <input 
                    type='file' ref={inputRef} 
                    style={{ display: 'none' }} 
                    onChange = {event => {
                        var formData = new FormData();
                        formData.append('file',event.target.files[0])
                        console.log(formData)
                    }}

                />
                <button className='btn btn-primary' onClick = {() => inputRef.current.click()}>
                    Upload Document
                </button>
                <div>
                    Click Here to get started
                </div>
            </main>
        </div>
    )
}

export default DashboardScreen;