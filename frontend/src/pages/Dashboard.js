import React, { useEffect, useState } from 'react'
import MyDrawer  from '../components/MyDrawer'
import './Dashboard.css'
import MyTable from '../components/MyTable'
import Pagination from '@mui/material/Pagination'
import { FormControl, InputLabel, Select } from '@mui/material'
import MenuItem from '@mui/material/MenuItem';
import PyrforosImage from '../assets/images/pyrforos.svg'
import NtuaHeader from '../components/NtuaHeader'
import { DAMAGE_TYPES, REPORT_STATES } from '../config'




export default function Dashboard() {


    // ordering
    // time descending = 1
    // time ascending = 2

  const [ordering, setOrdering] = useState(1);
  const [reportStateSelected, setReportStateSelected] = useState("");
  const [damageTypeSelected, setDamageTypeSelected] = useState("");
  const [page, setPage] = useState(1);
  
  const [data, setData] = useState(null);
  // total pages for pagination
  const [totalPages, setTotalPages] = useState(null);

  async function fetchData() {
    const response = await fetch(`http://127.0.0.1:8000/api/get_reports/?page=${page}&damage_type=${damageTypeSelected}&damage_status=${reportStateSelected}&order_by=${ordering}`);
    
    if(!response.ok){return}

    const responseJson = await response.json();
    console.log(responseJson);
    setData(responseJson?.data);
    setTotalPages(responseJson?.total_pages)
  }

  useEffect( () => {
    fetchData();
  }, [ordering, reportStateSelected, damageTypeSelected, page])
  
  async function handleOrderingChange(event) {
    setOrdering(event.target.value);
  }
  async function handleDamageTypeChange(event){
    setDamageTypeSelected(event.target.value);
  }
  async function handleReportStateChange(event) {
    setReportStateSelected(event.target.value)
  }

  // clear filters
  async function clearFilters(){
    setReportStateSelected("");
    setDamageTypeSelected("");
  }

  if (data)
  return (
    <>
            <MyDrawer />

    <NtuaHeader/>

    <div className='dashboard-container'>
      <h1 className='dashboard-header title-with-hr'>Αναφορές Ζημιών</h1>
      <div className='dashboard-content'>
        <div className='dashboard-filters'>
          <div className='dashboard-filter-group'>

          <FormControl>
                <InputLabel id='report-order-label' size='small'>Ταξινόμηση</InputLabel>
                <Select
                  labelId='report-order-label'
                  id='report-order-select'
                  value={ordering}
                  label="Ταξινόμηση"
                  size='small'
                  onChange={handleOrderingChange}
                >
                    <MenuItem value="1" selected>Πιο Πρόσφατα</MenuItem>
                    <MenuItem value="2">Παλαιότερα</MenuItem>

                </Select>
              </FormControl>
              <FormControl>
                <InputLabel id='damage-type-label' size='small'>Τύπος Ζημιάς</InputLabel>
                <Select
                  labelId='damage-type-label'
                  id='damage-type-select'
                  value={damageTypeSelected}
                  label="Τύπος Ζημιάς"
                  size='small'
                  onChange={handleDamageTypeChange}
                >
                    {DAMAGE_TYPES.map(damage_type => {
                      return <MenuItem value={damage_type.title}>{damage_type.title}</MenuItem>
                    })}
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel id='report-state-label' size='small'>Κατάσταση Ζημιάς</InputLabel>
                <Select
                  labelId='report-state-label'
                  id='report-state-select'
                  value={reportStateSelected}
                  label="Κατάσταση Ζημιάς"
                  size='small'
                  onChange={handleReportStateChange}
                >
                    {REPORT_STATES.map(state => {
                    return <MenuItem value={state.title}>{state.title}</MenuItem>
                  })}
                </Select>
              </FormControl>
            </div>

         {data.length > 0 && <Pagination count={totalPages} color='primary' onChange={(event, value) => setPage(value)}/>}
        </div>
        {(damageTypeSelected || reportStateSelected ) && <div className='clear-filters-wrapper'><a href="#" onClick={clearFilters}>Καθαρισμός Φίλτρων</a></div>}

        <div className='dashboard-table'>
          {data.length > 0 ? <MyTable data={data}/> : <h4>Δεν βρέθηκαν αναφορές με τα χαρακτηριστικά αυτά.</h4>}
        </div>
      </div>

    </div>

    </>
  )
}
