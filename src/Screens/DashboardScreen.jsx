import React, { useRef, useState } from 'react';
import SideNavComponent from '../Components/SideNavComponent';
import Axios from 'axios';

const DashboardScreen = (props) => {
    const inputRef = useRef(null);
    const [imageSrc, setImageSrc] = useState("");

    return (
        <div style={{ display: 'flex' }}>
            <SideNavComponent {...props} />
            <main className='main-body'>
                <input
                    type='file' ref={inputRef}
                    style={{ display: 'none' }}
                    onChange={event => {
                        var formData = new FormData();
                        var value = (event.target.files[0].name).split(".")[0];
                        formData.append('file', event.target.files[0])
                        Axios.post("http://localhost:8080/hello", formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        }).then(() => {
                            console.log(value);
                            Axios.get('http://localhost:8080/get', { responseType: 'arraybuffer' })
                                .then(response => {
                                    const base64 = btoa(
                                        new Uint8Array(response.data).reduce(
                                            (data, byte) => data + String.fromCharCode(byte),
                                            '',
                                        ),
                                    );
                                    setImageSrc("data:;base64," + base64);
                                })
                        })
                    }}

                />
                {(imageSrc === "") ? <>
                    <button className='btn btn-primary' onClick={() => inputRef.current.click()}>
                        Upload Document
                </button>
                    <div>
                        Click Here to get started
                </div>
                </> : <img alt="acquired" src={imageSrc}></img>}
            </main>
        </div>
    )
}

export default DashboardScreen;