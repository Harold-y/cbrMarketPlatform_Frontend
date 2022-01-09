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
  { id: 'state_id', label: 'ID', minWidth: 50 },
  { id: 'region_id', label: 'Region ID', minWidth: 100 },
  { id: 'state_name', label: 'State Name', minWidth: 20 },
  { id: 'region_name', label: 'Region Name', minWidth: 20 },
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

const States = () => {

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
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalPage, setTotalPage] = React.useState(0);

  const [addStateName, setAddStateName] = React.useState("");

  const [editCountryID, setEditCountryID] = React.useState(0);
  const [editStateId, setEditStateId] = React.useState(0);
  const [editStateName, setEditStateName] = React.useState("");

  const [searchContent, setSearchContent] = React.useState('');
  const [searchStatus, setSearchStatus] = React.useState(false);

  useEffect(() => {
    const getStates = async () => {
      const res =
        await axios.get(`http://localhost:8082/state/queryAllStates`, {
          params: {
            page: page,
            rowsPerPage: rowsPerPage
          }
        });
      setRow(res.data.t);
      setTotalPage(res.data.info);
    };

    getStates()
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
    if (!addStateName) {
      alert('Please add all fields!')
      return
    }
    axios.post(`http://localhost:8082/state/addState`, qs.stringify({
      stateName: addStateName,
      regionId: countrySelect['id']
    })).then(function (response) {
      if (response.data) {
        setSuccessInsert(true);
        setTimeout(() => { setSuccessInsert(false) }, 3000);
        setAddOpen(false);
      }
    });
    setAddStateName('');
    setCountrySelect([]);
  }

  const deleteFunction = (Id) => {
    axios.delete(`http://localhost:8082/state/deleteStateById`, {
      params: {
        stateId: Id,
      }
    }).then(function (response) {
      if (response.data) {
        setSuccessDelete(true);
        setTimeout(() => { setSuccessDelete(false) }, 3000);
      }
    })
  }

  const getEditFunction = (Id) => {
    setEditCountryID(Id);
    axios.get(`http://localhost:8082/state/selectStateById`, {
      params: {
        stateId: Id,
      }
    }
    ).then(function (response) {
      setEditStateId(response.data.t.state_id);
      setEditStateName(response.data.t.state_name);
      setEditCountryID(response.data.t.region_id);
      setCountrySelect({'label': response.data.t.region_name, 'id': response.data.t.region_id});
    });

  }

  const editCountryFunction = (e) => {
    e.preventDefault();
    if (!editCountryID || !editStateId || !editStateName) {
      alert('Please add all fields!')
      return
    }
    axios.post(`http://localhost:8082/state/updateStateById`, qs.stringify({
      stateId: editStateId,
      stateName: editStateName,
      regionId: countrySelect['id'],
    })).then(function (response) {
      if (response.data) {
        setSuccessEdit(true);
        setTimeout(() => { setSuccessEdit(false) }, 3000);
        setEditOpen(false);
      }
    });
    setEditStateId(0);
    setEditStateName('');
    setEditCountryID(0);
    setCountrySelect([]);
  }

  
  const queryAllRegions = () => {
    axios.get(`http://localhost:8082/region/queryAllRegionAll`).then(
        (response) => {
          let arr = response.data.t;
          setCountryRows(arr.map(x => {return {label:x.regionName, id:x.regionId}}));
        }
      )
  };

  const searchFunction = () => {
    if(searchContent === '')
    {
        setSearchStatus(!searchStatus);
    }else
    {
        axios.get(`http://localhost:8082/state/searchState`, {
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
      <h1>Edit State
        <Button variant="outlined" color="success" style={{ marginLeft: '2rem' }} onClick={() => {handleAddModal(); queryAllRegions(); setCountrySelect([])}}>
          <AddIcon />Add State
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
              <TextField fullWidth label="State Name" id="stateName" value={addStateName}
                style={{ marginTop: '1rem' }} onChange={(e) => setAddStateName(e.target.value)} />
              <Button variant="contained" color="success" style={{ marginTop: '2rem', marginLeft: '15%' }} onClick={addNewFunction}>
                Add New State
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
            <form onSubmit={editCountryFunction}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Let's Edit
              </Typography>
              <TextField fullWidth label="State ID" id="stateId" value={editStateId}
                style={{ marginTop: '1rem' }} onChange={(e) => setEditStateId(e.target.value)} />
              <Autocomplete style={{ marginTop: '1rem' }}
                value = {countrySelect}
                onChange={(event, newValue) => {setCountrySelect(newValue);}}
                disablePortal
                id="selectCountry"
                options={countryRows}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Region" />}
              />
              <TextField fullWidth label="State Name" id="regionShortname" value={editStateName}
                style={{ marginTop: '2rem' }} onChange={(e) => setEditStateName(e.target.value)} />
              <Button variant="contained" color="success" style={{ marginTop: '2rem', marginLeft: '15%' }} onClick={editCountryFunction}>
                Edit Country (Region)
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
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.state_id}>
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
                        <Button variant="outlined" color="error" onClick={() => { deleteFunction(row.state_id) }}>
                          <DeleteIcon />Delete
                        </Button>
                        <Button variant="outlined" onClick={() => { setEditOpen(true); getEditFunction(row.state_id); queryAllRegions() }}
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

export default States
