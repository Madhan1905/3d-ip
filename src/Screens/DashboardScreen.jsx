import React, { useRef, useState } from 'react';
import SideNavComponent from '../Components/SideNavComponent';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import Axios from 'axios';
import { storeRenderDetails } from '../Services/FirebaseService';

const DashboardScreen = (props) => {
    const inputRef = useRef(null);
    const [imageSrc, setImageSrc] = useState("");
    const [rating, setRating] = useState([false, false, false, false, false]);
    const [disabled, setDisbaled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [progressWidth,setProgressWidth] = useState("0%");
    const [renderTime,setRenderTime] = useState(0);
    const [submit,setSubmit] = useState("Submit");

    const changeRating = (index) => {
        let tempArray = rating.slice();
        tempArray.fill(false, 0);
        tempArray.fill(true, 0, index + 1);
        setRating(tempArray);
        setDisbaled(false);
    }

    const showImage = () => {
        return (
            <div className='dashboard-main'>
                <img alt="acquired" src={imageSrc}></img><br />
                <div className='feedback'>
                    <span style={{ marginRight: '2vw' }}>
                        Please provide your feedback for the rendered image
                    </span>
                    <div className='rating'>
                        <SentimentVeryDissatisfiedIcon onClick={() => changeRating(0)} style={{ color: rating[0] ? 'steelBlue' : "black" }} />
                        <SentimentDissatisfiedIcon onClick={() => changeRating(1)} style={{ color: rating[1] ? 'steelBlue' : "black" }} />
                        <SentimentSatisfiedIcon onClick={() => changeRating(2)} style={{ color: rating[2] ? 'steelBlue' : "black" }} />
                        <SentimentSatisfiedAltIcon onClick={() => changeRating(3)} style={{ color: rating[3] ? 'steelBlue' : "black" }} />
                        <SentimentVerySatisfiedIcon onClick={() => changeRating(4)} style={{ color: rating[4] ? 'steelBlue' : "black" }} />
                    </div>
                </div>
                <button className='btn btn-primary' disabled={disabled} onClick = {() => {
                    setDisbaled(true);
                    setSubmit("Submitting...");
                    let ratingCount = rating.filter(value => value === true).length;
                    storeRenderDetails(renderTime,ratingCount)
                    .then(() => {
                        setImageSrc("");
                        setSubmit("Submit");
                        setRating([false, false, false, false, false]);
                    })
                }}>
                    {submit}
                </button>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex' }}>
            <SideNavComponent title = 'Dashboard' />
            <main className='main-body'>
                <input
                    type='file' ref={inputRef}
                    style={{ display: 'none' }}
                    onChange={event => {
                        let startDate = new Date();
                        setLoading(true);
                        setProgressWidth("25%");
                        var formData = new FormData();
                        formData.append('file', event.target.files[0])
                        Axios.post("http://localhost:8080/hello", formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        }).then(() => {
                            setProgressWidth("50%");
                            Axios.get('http://localhost:8080/get', { responseType: 'arraybuffer' })
                                .then(response => {
                                    const base64 = btoa(
                                        new Uint8Array(response.data).reduce(
                                            (data, byte) => data + String.fromCharCode(byte),
                                            '',
                                        ),
                                    );
                                    setImageSrc("data:;base64," + base64);
                                    setLoading(false);
                                })
                        })
                        let endDate = new Date();
                        setRenderTime((endDate.getTime() - startDate.getTime()));
                    }}

                />
                {!loading && <>
                    {(imageSrc === "") ? <>
                        <button className='btn btn-primary' onClick={() => inputRef.current.click()}>
                            Upload Document
                    </button>
                        <div>
                            Click Here to get started
                    </div>
                    </> : showImage()}
                </>}
                {loading && <>
                    <div className = 'w-100' style = {{display:"flex",justifyContent:"center"}}>
                    <div className="progress" style={{ width:  "75%"}}>
                        <div className="progress-bar" role="progressbar" style={{ width: progressWidth }}></div>
                    </div>
                    </div>
                </>}
            </main>
        </div>
    )
}

export default DashboardScreen;