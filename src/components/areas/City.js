import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import { useEffect } from 'react';
import { Button } from '@mui/material';
import Modal from '@mui/material/Modal';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import { TextField } from '@mui/material';
import { Alert } from '@mui/material';
import { AlertTitle } from '@mui/material';
import qs from 'qs';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import { Autocomplete } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const columns = [
  { id: 'city_id', label: 'City ID', minWidth: 20 },
  { id: 'state_id', label: 'State ID', minWidth: 20 },
  { id: 'region_id', label: 'Region Id', minWidth: 20 },
  { id: 'city_name', label: 'City Name', minWidth: 50 },
  { id: 'state_name', label: 'State Name', minWidth: 50 },
  { id: 'region_name', label: 'Region Name', minWidth: 50 },
  { id: 'operation', label: 'Operation', minWidth: 30 }
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const City = () => {

  const [addOpen, setAddOpen] = React.useState(false);
  const handleAddModal = () => {setAddOpen(!addOpen)};

  const [editOpen, setEditOpen] = React.useState(false);
  const handleEditModal = () => setEditOpen(!editOpen);

  const [successInsert, setSuccessInsert] = React.useState(false);
  const [successDelete, setSuccessDelete] = React.useState(false);
  const [successEdit, setSuccessEdit] = React.useState(false);

  const [rows, setRow] = React.useState([]);
  const [countryRows, setCountryRows] = React.useState([]);
  const [countrySelect, setCountrySelect] = React.useState([]);
  const [stateRows, setStateRows] = React.useState([]);
  const [stateSelect, setStateSelect] = React.useState([]);
  const [holdStateChange, setHoldStateChange] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalPage, setTotalPage] = React.useState(0);

  const [addCityName, setAddCityName] = React.useState("");

  const [editCityId, setEditCityId] = React.useState(0);
  const [editCityName, setEditCityName] = React.useState("");

  const [searchContent, setSearchContent] = React.useState('');
  const [searchStatus, setSearchStatus] = React.useState(false);

  useEffect(() => {
    const getCity = async () => {
      const res =
        await axios.get(`http://localhost:8082/city/queryAllCity`, {
          params: {
            page: page,
            rowsPerPage: rowsPerPage
          }
        });
      setRow(res.data.t);
      setTotalPage(res.data.info);
    };

    getCity()
  }, [page, rowsPerPage, successInsert, successDelete, successEdit, searchStatus])


  const handleChangePage = (event, newPage) => {
    setPage(newPage);

  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  const addNewFunction = (e) => {
    e.preventDefault();
    if (!addCityName) {
      alert('Please add all fields!')
      return
    }
    axios.post(`http://localhost:8082/city/addCity`, qs.stringify({
      cityName: addCityName,
      stateId: stateSelect['id']
    })).then(function (response) {
      if (response.data) {
        setSuccessInsert(true);
        setTimeout(() => { setSuccessInsert(false) }, 3000);
        setAddOpen(false);
      }
    });
    setAddCityName('');
    setCountrySelect([]);
    setStateSelect([]);
  }

  const deleteFunction = (Id) => {
    axios.delete(`http://localhost:8082/city/deleteCityById`, {
      params: {
        cityId: Id,
      }
    }).then(function (response) {
      if (response.data) {
        setSuccessDelete(true);
        setTimeout(() => { setSuccessDelete(false) }, 3000);
      }
    })
  }

  const getEditFunction = (Id) => {

    axios.get(`http://localhost:8082/city/selectCityById`, {
      params: {
        cityId: Id,
      }
    }
    ).then(function (response) {
      setEditCityId(response.data.t.city_id);
      setEditCityName(response.data.t.city_name);
      setHoldStateChange(true);
      setCountrySelect({'label': response.data.t.region_name, 'id': response.data.t.region_id});
      setStateSelect({'label': response.data.t.state_name, 'id': response.data.t.state_id});
      setHoldStateChange(false);
    });
  }

  const editFunction = (e) => {
    e.preventDefault();
    if (!stateSelect || !editCityId || !editCityName) {
      alert('Please add all fields!')
      return
    }
    axios.post(`http://localhost:8082/city/updateCityById`, qs.stringify({
      stateId: stateSelect['id'],
      cityId: editCityId,
      cityName: editCityName,
    })).then(function (response) {
      if (response.data) {
        setSuccessEdit(true);
        setTimeout(() => { setSuccessEdit(false) }, 3000);
        setEditOpen(false);
      }
    });
    setEditCityId(0);
    setEditCityName('');
    setCountrySelect([]);
    setStateSelect([]);
  }

  const queryAllRegions = async () => {
    await axios.get(`http://localhost:8082/region/queryAllRegionAll`).then(
        (response) => {
          let arr = response.data.t;
          setCountryRows(arr.map(x => {return {label:x.regionName, id:x.regionId}}));
        }
      )
      
  };
  
  useEffect(() => {
    const getStates = async () => {
        if(countrySelect !== [] && countrySelect != null)
        {
          await axios.get(`http://localhost:8082/state/selectStateByRegionId`, {
          params: {
           regionId:countrySelect['id']
          }
          }).then((response) => {
            let arr = response.data.t;
            setStateRows(arr.map(x => {return {label:x.state_name, id:x.state_id}}));
          });
        }else
        {
          setStateRows([]);
        }
        if(!holdStateChange)
          setStateSelect([]);
    };
    
    getStates()
  }, [countrySelect])

  const searchFunction = () => {
    if(searchContent === '')
    {
        setSearchStatus(!searchStatus);
    }else
    {
        axios.get(`http://localhost:8082/city/searchCity`, {
            params: {
                    page: page,
                    rowsPerPage: rowsPerPage,
                    'searchContent': searchContent
                }
            }).then((res) => {
                setRow(res.data.t);
                setTotalPage(res.data.info);
            });
      }
  }

  return (
    <>
      <h1>Edit City
        <Button variant="outlined" color="success" style={{ marginLeft: '2rem' }} onClick={() => {handleAddModal(); queryAllRegions(); setCountrySelect([])}}>
          <AddIcon />Add City
        </Button>
        <TextField id="outlined-basic" style={{ marginLeft: '2rem' }} label="Search" variant="outlined" value={searchContent}
                    onChange={(e) => setSearchContent(e.target.value)}/>
        <Button variant="outlined" startIcon={<SearchIcon/>} style={{ marginLeft: '2rem' }} onClick={searchFunction}>
            Search
        </Button>
      </h1>
      {successInsert ? (<Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        Insert Successful — <strong>Affected Rows: 1!</strong>
      </Alert>) : ''}
      {successEdit ? (<Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        Edit Successful — <strong>Affected Rows: 1!</strong>
      </Alert>) : ''}
      {successDelete ? (<Alert severity="info">Delete Successful — Affected Rows: 1!</Alert>
      ) : ''}
      <Modal
        open={addOpen}
        onClose={handleAddModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={addOpen}>
          <Box sx={style}>
            <form onSubmit={addNewFunction}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Let's Add
              </Typography>
              <Autocomplete style={{ marginTop: '1rem' }}
                value = {countrySelect}
                onChange={(event, newValue) => {setCountrySelect(newValue);}}
                disablePortal
                id="selectCountry"
                options={countryRows}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Region" />}
              />
              <Autocomplete style={{ marginTop: '1rem' }}
                value = {stateSelect}
                onChange={(event, newValue) => {setStateSelect(newValue);}}
                disablePortal
                id="selectState"
                options={stateRows}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="States" />}
              />
              <TextField fullWidth label="City Name" id="cityName" value={addCityName}
                style={{ marginTop: '1rem' }} onChange={(e) => setAddCityName(e.target.value)} />
              <Button variant="contained" color="success" style={{ marginTop: '2rem', marginLeft: '15%' }} onClick={addNewFunction}>
                Add New City
              </Button>
            </form>
          </Box>
        </Fade>

      </Modal>
      <Modal
        open={editOpen}
        onClose={handleEditModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={editOpen}>
          <Box sx={style}>
            <form onSubmit={editFunction}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Let's Edit
              </Typography>
              <TextField fullWidth label="City ID" id="cityId" value={editCityId}
                style={{ marginTop: '1rem' }} onChange={(e) => setEditCityId(e.target.value)} />
              <Autocomplete style={{ marginTop: '1rem' }}
                value = {countrySelect}
                onChange={(event, newValue) => {setCountrySelect(newValue);}}
                disablePortal
                id="selectCountry"
                options={countryRows}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Region" />}
              />
              <Autocomplete style={{ marginTop: '1rem' }}
                value = {stateSelect}
                onChange={(event, newValue) => {setStateSelect(newValue);}}
                disablePortal
                id="selectStateEdit"
                options={stateRows}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="States" />}
              />
              <TextField fullWidth label="City Name" value={editCityName}
                style={{ marginTop: '2rem' }} onChange={(e) => setEditCityName(e.target.value)} />
              <Button variant="contained" color="success" style={{ marginTop: '2rem', marginLeft: '15%' }} onClick={editFunction}>
                Edit City
              </Button>
            </form>
          </Box>
        </Fade>

      </Modal>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 1000 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.city_id}>
                      {columns.filter(x => x.id !== 'operation').map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                      <TableCell key='3' align={columns[3].align}>
                        <Button variant="outlined" color="error" onClick={() => { deleteFunction(row.city_id) }}>
                          <DeleteIcon />Delete
                        </Button>
                        <Button variant="outlined" onClick={() => { setEditOpen(true); getEditFunction(row.city_id); queryAllRegions() }}
                           color="secondary" style={{ marginLeft: '2rem' }} >
                          <ChangeCircleIcon />Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={totalPage * rowsPerPage}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>

  );
}

export default City
