import React, { useEffect, useState } from 'react'
import './DamageReport.css'
import MyDrawer from '../components/MyDrawer'
import { FormControl, InputLabel, TextField, Button, setRef } from '@mui/material'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import NtuaHeader from '../components/NtuaHeader';
import DamageImage from '../assets/sample-damage.jpg'
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useParams } from 'react-router-dom'
import { REPORT_STATES } from '../config';
import DeleteIcon from '@mui/icons-material/Delete';
import IosShareIcon from '@mui/icons-material/IosShare';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';


const customMarker = new L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [13, 0]
  });

export default function DamageReport() {


    const {reportID} = useParams();
    const [newReportStatus, setNewReportStatus] = useState("");
    const [newDamageReportNotes, setNewDamageReportNotes] = useState("");
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState("Επικίνδυνη Ζημιά");
    const [data, setData] = useState(null);

    // loading for report update
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);


    const position = [37.976906, 23.780147]

    async function fetchData() {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:8000/api/get_report/?report_id=${reportID}`)
        
        if(!response.ok) {
            setLoading(false);
            return;
        };

        const responseJson = await response.json();

        setData(responseJson?.data)
        setNewReportStatus(responseJson?.data?.damage_status)
        setNewDamageReportNotes(responseJson?.data?.damage_report_notes)
        setLoading(false);
    }

    useEffect( () => {
        fetchData();
    }, [])

    async function handleStatusChange(e) {
        setNewReportStatus(e.target.value)
    }
    async function handleDamageReportNotesChange(e) {
        setNewDamageReportNotes(e.target.value);
    }

    async function updateReport() {
        setLoadingUpdate(true);
        setError(null);
        setSuccess(null);
        // double check that something has been updated...
        if (!(data?.damage_status !== newReportStatus || data?.damage_report_notes !== newDamageReportNotes)){
            setLoadingUpdate(false);
            return;
        }
        const payload = {
            reportID: parseInt(data?.report_id),
            new_report_status: newReportStatus,
            new_damage_report_notes: newDamageReportNotes,
        }

        const response = await fetch('http://127.0.0.1:8000/api/update_damage_report/', {method:'POST',      headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }, body:JSON.stringify(payload)});
        
        if(!response.ok) {
            setError("Κάτι πήγε λάθος. Παρακαλώ προσπαθείστε ξανά αργότερα.")
            setLoadingUpdate(false);
            return;
        }

        const responseJSON = await response.json();

        if(responseJSON.error) {
            setError(responseJSON?.data?.msg);
            setLoadingUpdate(false);
            return
        }
        setSuccess(responseJSON?.data?.msg);
        setLoadingUpdate(false);
        fetchData();

    }
    // implement later...
    async function deleteReport() {

    }

  return (
    <>
        <MyDrawer />
        <NtuaHeader/>

        <div className='report-container'>
            <h1 className='report-title title-with-hr'>Αναφορά Ζημιάς</h1>
            {loading && <Skeleton variant="rectangular" width={"100%"} height={500} style={{marginTop:50, borderRadius:4}}/>}
            {data && <div className='report-details'>
                <div className='col'>
                    <FormControl>
                        <TextField
                            inputProps={{ readOnly: true }}
                            disabled
                            label="Αναγνωριστικό Ζημιάς"
                            value={data.report_id}
                            size='small'
                        />
                    </FormControl>
                    <FormControl>
                        {/* <InputLabel id="report-type-label" size='small'>Τύπος Ζημιάς</InputLabel> */}
                        <TextField
                            inputProps={{ readOnly: true }}
                            disabled
                            // labelId="report-type-label"
                            // id="demo-select-small"
                            value={data.damage_type}
                            label="Τύπος Ζημιάς"
                            // onChange={handleStatusChange}
                            size='small'
                            style={{minWidth:200}}
                        >
                        </TextField>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="report-status-label" size='small'>Κατάσταση Ζημιάς</InputLabel>
                        <Select
                            labelId="report-status-label"
                            id="demo-select-small"
                            value={newReportStatus}
                            label="Κατάσταση Ζημιάς"
                            onChange={handleStatusChange}
                            size='small'
                            style={{minWidth:200}}
                        >
                            {REPORT_STATES.map((state)  => {
                                return <MenuItem value={state.title}>{state.title}</MenuItem>

                            })}

                        </Select>
                    </FormControl>
                    <FormControl>
                        <TextField
                            inputProps={{ readOnly: true }}
                            disabled
                            id="outlined-multiline-static"
                            label="Λεπτομέρειες Ζημιάς (από χρήστη)"
                            multiline
                            rows={6}
                            value={data.description}
                        />
                    </FormControl>
                    <FormControl>
                        <TextField
                            id="outlined-multiline-static"
                            label="Σημειώσεις (για την διαχείριση)"
                            multiline
                            rows={6}
                            value={newDamageReportNotes}
                            onChange={handleDamageReportNotesChange}
                        />
                    </FormControl>
                    <FormControl style={{rowGap:10}}>
                        <Button variant="contained" disabled={!(data?.damage_status !== newReportStatus || data?.damage_report_notes !== newDamageReportNotes) || loadingUpdate} onClick={updateReport}>ΕΝΗΜΕΡΩΣΗ <IosShareIcon style={{marginLeft:3}}/></Button>
                        <Button variant="outlined">ΜΕΤΑΤΡΟΠΗ ΣΕ PDF <PictureAsPdfIcon style={{marginLeft:3}}/></Button>
                        <Button variant="contained" color="error">ΔΙΑΓΡΑΦΗ <DeleteIcon style={{marginLeft:3}}/></Button>
                        {error && <Alert severity="error">{error}</Alert>}
                        {success && <Alert severity="success">{success}</Alert>}
                    </FormControl>
                        
                    

                </div>
                <div className='col'>
                    <img src={data.image} className='report-image' />
                </div>
                <div className='col'>
                <MapContainer center={position} zoom={15} scrollWheelZoom={false} maxZoom={18} style={{ height: 400, minWidth: 400, borderRadius:4 }}>
                    <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position} icon={customMarker}>
                    <Popup>
                        Τοποθεσία Ζημιάς
                    </Popup>
                    </Marker>
                </MapContainer>
                </div>
            </div>}
        </div>
</>
  )
}
